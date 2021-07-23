const { SubmissionStream } = require('snoostorm');

function createSearchStream(requester, subs) {

  const parsedSubs = parseSubs(subs);

  return new SubmissionStream(requester, {
    subreddit: parsedSubs,
    limit: 10,
    pollTime: 5000
  });
}

function parseKeywords(input) {
  const strArray = input.split(',');
  const result = [];
  strArray.forEach(word => {
    if (word.length === 0) return;
    if (word[0] === ' ') {
      result.push(word.slice(1));
    } else {
      result.push(word);
    }
  });
  return result;
}

function parseSubs(input) {
  const strArray = input.split(',');
  const result = [];
  strArray.forEach(word => {
    if (word.length === 0) return;
    if (word[0] === ' ') {
      result.push(word.slice(1));
    } else {
      result.push(word);
    }
  });
  return result.join('+');
}

module.exports = { createSearchStream, parseKeywords };
