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
        throw new ClientError(401, 'user not found');
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
    .catch(err => next(err));
});

submissionStreams.on('connection', socket => {

});

app.post('/api/search', (req, res, next) => {
  const { keywords, subreddits, sendToInbox } = req.body;
  if (!keywords || !subreddits || sendToInbox === null) {
    throw new ClientError(400, 'missing search terms');
  }

  const submissions = createSearchStream(req.user.requester, subreddits);

  const submissionsList = [];
  const parsedKw = parseKeywords(keywords);

  submissions.on('item', submission => {
    if (parsedKw.some(word => submission.title.toLowerCase().includes(word.toLowerCase()))) {
      submissionsList.push(submission);
    }
    if (submissionsList.length >= 5) submissions.end();
  });

  submissions.on('end', function submissionEnd() {
    res.json(submissionsList);
  });
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

app.use(errorMiddleware);

server.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});

module.exports = db;
