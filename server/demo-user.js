require('dotenv/config');
const db = require('./db');

const sql = `
      insert into "users" ("username", "refreshToken")
           values ($1, $2);
`;

const params = [process.env.DEMO_USER, process.env.DEMO_REFRESH];

db.query(sql, params)
  .then(() => db.end())
  .catch(err => console.error(err));
