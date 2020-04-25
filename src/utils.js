const isGitInsert = (input) => /^\+(\w| )/.test(input);
const trimValues = (input) => input.trim();

const getOnlyInserts = (chunk) => {
  return chunk.split('\n').map(trimValues).filter(isGitInsert);
};

module.exports = {
  isGitInsert,
  getOnlyInserts,
};
