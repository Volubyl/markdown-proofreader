const { pipe, filter, map, split, join, replace, trim } = require('lodash/fp');

// We are only intersted by strings beginning by '+' and not by those beginning by '++'
const isGitInsert = (input) => /^\+[^+]/.test(input);
const replaceGitInsertSign = (input) => replace('+', '', input);

const getOnlyGitInserts = (chunk) => {
  return pipe(
    split('\n'),
    map(trim),
    filter(isGitInsert),
    map(replaceGitInsertSign),
    map(trim),
    join('\n')
  )(chunk);
};

module.exports = {
  isGitInsert,
  getOnlyGitInserts,
};
