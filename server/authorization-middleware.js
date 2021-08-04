const jwt = require('jsonwebtoken');
const ClientError = require('./client-error');
const Snoowrap = require('snoowrap');
require('dotenv/config');
const db = require('./db');

function authorizationMiddleware(req, res, next) {
  if (!req.signedCookies.userToken) {
    throw new ClientError(401, 'authentication required');
  }

  const payload = jwt.verify(req.signedCookies.userToken, process.env.TOKEN_SECRET);

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
      req.user = user;
      next();
    })
    .catch(err => next(err));
}

module.exports = authorizationMiddleware;
