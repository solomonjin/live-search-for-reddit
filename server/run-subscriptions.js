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
    select "s"."subscriptionId",
           "s"."keywords",
           "s"."subreddits",
           "s"."createdAt",
           "u"."username"
      from "subscriptions" as "s"
      join "users" as "u" using ("userId");
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

      return r
        .search(searchParams)
        .then(listings => {
          const submissions = [];
          listings.forEach(post => {
            if (subTime > post.created_utc) return;
            submissions.push({
              title: post.title,
              url: post.url
            });
          });
          if (submissions.length === 0) {
            return updateTime(sub.subscriptionId);
          }

          const text = submissions.reduce((msg, line) => {
            return msg + `[${line.title}](${line.url})` + '\n\n';
          }, '');
          const message = {
            to: sub.username,
            subject: `${submissions.length} results found`,
            text
          };
          return r
            .composeMessage(message)
            .then(result => {
              return updateTime(sub.subscriptionId);
            });
        });
    });
  })
  .catch(err => console.error(err));

const updateTime = subId => {
  const sql = `
                  update "subscriptions"
                     set "createdAt" = now()
                   where "subscriptionId" = $1
              `;
  const params = [subId];

  return db.query(sql, params);
};
