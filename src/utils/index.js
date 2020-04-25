const { pipe, filter, map, split, join, replace, trim } = require('lodash/fp');

const isGitInsert = (input) => /^\+(\w| )/.test(input);
const replaceGitInsertSign = (input) => replace('+', '', input);

const getOnlyInserts = (chunk) => {
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
  getOnlyInserts,
};
