require('dotenv/config');
const express = require('express');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const pg = require('pg');
const snoowrap = require('snoowrap');
const snoostorm = require('snoostorm');
const { SubmissionStream } = snoostorm;

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();

app.use(staticMiddleware);

app.use(errorMiddleware);

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
  res.send(snoowrap.getAuthUrl({
    clientId: process.env.CLIENT_ID,
    scope: ['identity', 'privatemessages', 'read'],
    redirectUri: 'http://localhost:3000/',
    permanent: true
  }));
});

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.DEV_SERVER_PORT}`);
});
