const jwt = require('jsonwebtoken');
const ClientError = require('./client-error');
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
      const [user] = result.rows;
      if (!user) {
        throw new ClientError(401, 'user not found');
      }
      req.user = user;
      next();
    })
    .catch(err => next(err));
}

module.exports = authorizationMiddleware;
