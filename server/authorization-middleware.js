const jwt = require('jsonwebtoken');
const ClientError = require('./client-error');
require('dotenv/config');

function authorizationMiddleware(req, res, next) {
  if (!req.signedCookies.userToken) {
    throw new ClientError(401, 'authentication required');
  }

  const payload = jwt.verify(req.signedCookies.userToken, process.env.TOKEN_SECRET);

  req.user = payload;
  next();
}

module.exports = authorizationMiddleware;
