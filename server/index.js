require('dotenv/config');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
const authorizationMiddleware = require('./authorization-middleware');
const { createSearchStream, parseKeywords } = require('./createSearchStream');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const Snoowrap = require('snoowrap');
const ClientError = require('./client-error');
const db = require('./db');

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

app.get('/api/sign-in', (req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.json(Snoowrap.getAuthUrl({
    clientId: process.env.CLIENT_ID,
    scope: ['identity', 'privatemessages', 'read', 'submit'],
    redirectUri: 'http://localhost:3000/api/authorize',
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
    redirectUri: 'http://localhost:3000/api/authorize'
  })
    .then(requester => {
      return requester
        .getMe()
        .then(redditUser => {
          const sql = `
          select *
          from "users"
          where "username" = $1;
          `;
          const params = [redditUser.name];

          return db
            .query(sql, params)
            .then(result => {
              const [user] = result.rows;
              const sql = user
                ? `
                update "users"
                   set "refreshToken" = $2
                 where "username" = $1
             returning *;`
                : `
                insert into "users" ("username", "refreshToken")
                     values ($1, $2)
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
        });
    })
    .catch(err => next(err));
});

app.use(authorizationMiddleware);

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

      const requester = new Snoowrap({
        userAgent: 'keyword finder app v1.0 (by /u/buddhababy23)',
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
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

  const connectedAt = Date.now() / 1000;

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
            select *
              from "subscriptions"
            where "userId" = $1;
      `;

      const params = [userId];

      db.query(sql, params)
        .then(result => {
          const [subscription] = result.rows;

          const sql = subscription
            ? `
                update "subscriptions"
                  set "keywords" = $1,
                      "subreddits" = $2
                where "userId" = $3
            returning *;`
            : `
        insert into "subscriptions" ("keywords", "subreddits", "userId")
                             values ($1, $2, $3)
                          returning *;`;

          const params = [keywords, subreddits, userId];

          return db
            .query(sql, params)
            .then(res => {
              if (!res.rows[0]) {
                throw new ClientError(500, 'unexpected error occurred');
              }
            });
        })
        .catch(err => console.error(err));
    }
  });
});

submissionStreams.on('connect_error', err => {
  console.error(err);
});

app.post('/api/comment', (req, res, next) => {
  const { comment, submissionId } = req.body;
  if (!comment || !submissionId) {
    throw new ClientError(400, 'invalid request');
  }

  req.user.requester.getSubmission(submissionId).reply(comment)
    .then(userComment => {
      res.status(201).json(userComment);
    })
    .catch(err => next(err));
});

app.post('/api/message', (req, res, next) => {
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
      res.status(201).json(userMessage);
    })
    .catch(err => next(err));
});

app.get('/api/sign-out', (req, res, next) => {
  res.clearCookie('userToken', {
    httpOnly: true,
    signed: true
  });

  res.json({
    user: null,
    userId: null
  });
});

app.use(errorMiddleware);

server.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});

module.exports = db;
