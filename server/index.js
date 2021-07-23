require('dotenv/config');
const express = require('express');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
const authorizationMiddleware = require('./authorization-middleware');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const pg = require('pg');
const snoowrap = require('snoowrap');
const ClientError = require('./client-error');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();

app.use(staticMiddleware);

app.use(express.json());

app.use(cookieParser(process.env.COOKIE_SECRET));

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
  res.json(snoowrap.getAuthUrl({
    clientId: process.env.CLIENT_ID,
    scope: ['identity', 'privatemessages', 'read'],
    redirectUri: 'http://localhost:3000/api/authorize',
    permanent: true
  }));
});

app.get('/api/authorize', (req, res, next) => {
  const { code } = req.query;
  if (!code) {
    throw new ClientError(401, 'authorization error');
  }

  snoowrap.fromAuthCode({
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

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
