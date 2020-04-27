const { spawn } = require('child_process');
const { readFile } = require('fs');
const highland = require('highland');
const {
  isGitInsert,
  removeGitInsertSign,
  stripMarkdown,
  replaceGitStatusSign,
  isNewFile,
  trim,
} = require('.');

const getDiffContentStream = () => {
  const gitDiffStream = spawn('git', ['diff', '--cached', '**/*.md']).stdout;

  const cleanDiffContent = highland.pipeline(
    highland.split(),
    highland.filter(isGitInsert),
    highland.map(removeGitInsertSign)
  );

  return highland(gitDiffStream).pipe(cleanDiffContent);
};

const getNewFileContent = () => {
  const getGitStatusShortSummaryStream = spawn('git', [
    'status',
    '**/*md',
    '-s',
  ]).stdout;

  const readFileWrapper = highland.wrapCallback(readFile);

  const geNewFileList = highland.pipeline(
    highland.split(),
    highland.map(trim),
    highland.filter(isNewFile),
    highland.map(replaceGitStatusSign),
    highland.map(trim)
  );

  return highland(getGitStatusShortSummaryStream)
    .pipe(geNewFileList)
    .map(readFileWrapper)
    .parallel(3)
    .split();
};

const getBodyContent = () =>
  highland
    .concat(getNewFileContent(), getDiffContentStream())
    .map(stripMarkdown)
    .map((item) => {
      return item.replace('\n', '');
    })
    .collect()
    .toCallback((err, result) => {
      console.log(result);
    });

module.exports = getBodyContent;
