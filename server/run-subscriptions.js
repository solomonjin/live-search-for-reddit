require('dotenv/config');
const { parseKeywords, parseSubs } = require('./createSearchStream');
const Snoowrap = require('snoowrap');
const db = require('./db');

const r = new Snoowrap({
  userAgent: 'keyword finder bot v1.0 by (/u/buddhababy23)',
  clientId: process.env.SCRIPT_ID,
  clientSecret: process.env.SCRIPT_SECRET,
  username: process.env.REDDIT_USER,
  password: process.env.REDDIT_PW
});

const sql = `
    select *
      from "subscriptions";
`;

db.query(sql)
  .then(result => {
    result.rows.forEach(sub => {
      const keywords = parseKeywords(sub.keywords).join(' OR ');
      const subreddits = parseSubs(sub.subreddits);
      const subTime = Math.floor(new Date(sub.createdAt).getTime() / 1000);

      const searchParams = {
        query: keywords,
        subreddit: subreddits,
        sort: 'new',
        time: 'hour'
      };

      r.search(searchParams)
        .then(listings => {
          const submissions = [];
          listings.forEach(post => {
            if (subTime > post.created_utc) return;
            submissions.push({
              title: post.title,
              url: post.url
            });
          });

        });
    });
  });
