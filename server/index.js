require('dotenv/config');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
const authorizationMiddleware = require('./authorization-middleware');
const { createSearchStream, parseKeywords } = require('./create-search-stream');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const Snoowrap = require('snoowrap');
const ClientError = require('./client-error');
const db = require('./db');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(staticMiddleware);

app.use(express.json());

const parseCookies = cookieParser(process.env.COOKIE_SECRET);
app.use(parseCookies);

app.get('/api/auth', (req, res, next) => {
  let payload;
  if (!req.signedCookies.userToken) {
    payload = {
      user: null,
      userId: null
    };
  } else {
    payload = jwt.verify(req.signedCookies.userToken, process.env.TOKEN_SECRET);
  }
  res.json(payload);
});

app.get('/api/demo-sign-in', (req, res, next) => {
  const sql = `
      select *
        from "users"
       where "username" = $1;
  `;

  const params = [process.env.DEMO_USER];

  db.query(sql, params)
    .then(result => {
      const { username, userId } = result.rows[0];
      const newUser = { username, userId };
      const token = jwt.sign(newUser, process.env.TOKEN_SECRET);
      const cookieParams = {
        httpOnly: true,
        signed: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
      };

      res.cookie('userToken', token, cookieParams).json(newUser);
    });
});

app.get('/api/sign-in', (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.json(Snoowrap.getAuthUrl({
    clientId: process.env.CLIENT_ID,
    scope: ['identity', 'privatemessages', 'read', 'submit'],
    redirectUri: 'https://live-search-for-reddit.herokuapp.com/api/authorize',
    permanent: true
  }));
});

app.get('/api/authorize', (req, res, next) => {
  const { code } = req.query;
  if (!code) {
    throw new ClientError(401, 'authorization error');
  }

  Snoowrap.fromAuthCode({
    code,
    userAgent: 'keyword finder app v1.0 (by /u/buddhabab23',
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: 'https://live-search-for-reddit.herokuapp.com/api/authorize'
  })
    .then(requester => {
      return requester
        .getMe()
        .then(redditUser => {
          const sql = `
                insert into "users" ("username", "refreshToken")
                     values ($1, $2)
                         on conflict ("username")
                         do update
                        set "refreshToken" = $2
                  returning *;`;

          const params = [redditUser.name, requester.refreshToken];

          return db
            .query(sql, params)
            .then(result => {
              const { username, userId } = result.rows[0];
              const newUser = {
                username,
                userId
              };
              const token = jwt.sign(newUser, process.env.TOKEN_SECRET);
              const cookieParams = {
                httpOnly: true,
                signed: true,
                maxAge: 365 * 24 * 60 * 60 * 1000
              };
              res.cookie('userToken', token, cookieParams).redirect('/');
            });
        });
    })
    .catch(err => next(err));
});

const submissionStreams = io.of('/search').use((socket, next) => {
  parseCookies(socket.request, null, next);
});

submissionStreams.use((socket, next) => {
  const cookies = socket.request.signedCookies;
  if (!cookies.userToken) {
    next(new ClientError(401, 'authentication required'));
  }

  const payload = jwt.verify(cookies.userToken, process.env.TOKEN_SECRET);

  const sql = `
    select *
      from "users"
     where "userId" = $1;
  `;

  const params = [payload.userId];
  db.query(sql, params)
    .then(result => {
      const [userInfo] = result.rows;
      if (!userInfo) {
        next(new ClientError(401, 'user not found'));
      }

      let clientId;
      let clientSecret;
      if (userInfo.username === process.env.DEMO_USER) {
        clientId = process.env.DEMO_ID;
        clientSecret = process.env.DEMO_SECRET;
      } else {
        clientId = process.env.CLIENT_ID;
        clientSecret = process.env.CLIENT_SECRET;
      }

      const requester = new Snoowrap({
        userAgent: 'keyword finder app v1.0 (by /u/buddhababy23)',
        clientId,
        clientSecret,
        refreshToken: userInfo.refreshToken
      });

      const user = Object.assign({}, userInfo, { requester });
      socket.user = user;
      next();
    })
    .catch(next);
});

submissionStreams.on('connection', socket => {
  const { keywords, subreddits, toggleInbox } = socket.handshake.query;
  if (!keywords || !subreddits || toggleInbox === null) {
    throw new ClientError(400, 'missing search terms');
  }

  const connectedAt = Math.floor(Date.now() / 1000);

  const subStream = createSearchStream(socket.user.requester, subreddits);

  const parsedKw = parseKeywords(keywords);

  const botRequester = toggleInbox === 'true'
    ? new Snoowrap({
      userAgent: 'keyword finder bot v1.0 by (/u/buddhababy23)',
      clientId: process.env.SCRIPT_ID,
      clientSecret: process.env.SCRIPT_SECRET,
      username: process.env.REDDIT_USER,
      password: process.env.REDDIT_PW
    })
    : null;

  subStream.on('item', submission => {
    if (connectedAt > submission.created_utc) return;
    if (parsedKw.some(word => submission.title.toLowerCase().includes(word.toLowerCase()))) {
      socket.emit('new_submission', submission);
      if (botRequester !== null) {
        socket.user.requester.getMe()
          .then(user => {
            botRequester.composeMessage({
              to: user,
              subject: 'Keyword Found!',
              text: submission.url
            });
          })
          .catch(err => console.error(err));
      }
    }
  });

  const userId = socket.user.userId;

  socket.on('disconnect', socket => {
    subStream.end();

    if (botRequester) {
      const sql = `
        insert into "subscriptions" ("keywords", "subreddits", "userId")
             values ($1, $2, $3)
                 on conflict ("userId")
                 do update
               set "keywords" = $1,
                   "subreddits" = $2
         returning *;`;

      const params = [keywords, subreddits, userId];

      db.query(sql, params)
        .catch(err => console.error(err));
    }
  });
});

submissionStreams.on('connect_error', err => {
  console.error(err);
});

app.post('/api/comment', authorizationMiddleware, (req, res, next) => {
  const { comment, submissionId } = req.body;
  if (!comment || !submissionId) {
    throw new ClientError(400, 'invalid request');
  }

  req.user.requester.getSubmission(submissionId).reply(comment)
    .then(userComment => {
      res.status(201).json({ success: true });
    })
    .catch(err => next(err));
});

app.post('/api/message', authorizationMiddleware, (req, res, next) => {
  const { author, message, subject } = req.body;
  if (!author || !message || !subject) {
    throw new ClientError(400, 'invalid request');
  }

  const messageParams = {
    to: author,
    subject,
    text: message
  };

  req.user.requester.composeMessage(messageParams)
    .then(userMessage => {
      res.status(201).json({ success: true });
    })
    .catch(err => next(err));
});

app.get('/api/sign-out', authorizationMiddleware, (req, res, next) => {
  res.clearCookie('userToken', {
    httpOnly: true,
    signed: true
  });

  res.json({
    user: null,
    userId: null
  });
});

app.delete('/api/cancel', authorizationMiddleware, (req, res, next) => {
  const { userId } = req.user;

  const sql = `
      delete from "subscriptions"
            where "userId" = $1
        returning *;
  `;

  const params = [userId];

  db.query(sql, params)
    .then(result => {
      const [subscription] = result.rows;

      const payload = subscription || { subscriptionId: null };

      res.json(payload);
    })
    .catch(err => next(err));
});

app.use((req, res) => {
  res.sendFile('/index.html', {
    root: path.join(__dirname, 'public')
  });
});

app.use(errorMiddleware);

server.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});

module.exports = db;
