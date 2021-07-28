require('dotenv/config');

const Snoowrap = require('snoowrap');
const db = require('./db');

const r = new Snoowrap({
  userAgent: 'keyword finder bot v1.0 by (/u/buddhababy23)',
  clientId: process.env.SCRIPT_ID,
  clientSecret: process.env.SCRIPT_SECRET,
  username: process.env.REDDIT_USER,
  password: process.env.REDDIT_PW
});

r.getMe();

const sql = `
    select *
      from "subscriptions";
`;

db.query(sql)
  .then(result => {
  });
