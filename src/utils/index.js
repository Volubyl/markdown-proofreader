const { spawn } = require('child_process');
const { readFile } = require('fs');
const isNodeStream = require('is-stream');
const highland = require('highland');
const {
  isGitInsert,
  removeGitInsertSign,
  stripMarkdown,
  replaceGitStatusSign,
  isNewFile,
  trim,
  removeNewLign,
} = require('./helpers');

const getDiffContentStream = (gitDiffStream) => {
  if (!isNodeStream(gitDiffStream))
    throw new Error('Invalid Git Diff stream provided');

  const cleanDiffContent = highland.pipeline(
    highland.split(),
    highland.filter(isGitInsert),
    highland.map(removeGitInsertSign)
  );

  return highland(gitDiffStream).pipe(cleanDiffContent);
};

const getNewFileContent = (shortSummaryStream, readFileStream) => {
  if (!isNodeStream(shortSummaryStream))
    throw new Error('Invalid ShortSummary stream provided');

  if (!isNodeStream(shortSummaryStream))
    throw new Error('Invalid Read stream provided');

  const readFileWrapper = highland.wrapCallback(readFileStream);
  const geNewFileList = highland.pipeline(
    highland.split(),
    highland.map(trim),
    highland.filter(isNewFile),
    highland.map(replaceGitStatusSign),
    highland.map(trim)
  );
  return highland(shortSummaryStream)
    .pipe(geNewFileList)
    .map(readFileWrapper)
    .parallel(3)
    .split();
};

const getNewlyInsertedText = () => {
  const gitStatusShortSummaryStream = spawn('git', ['status', '**/*md', '-s'])
    .stdout;

  const gitDiffStream = spawn('git', ['diff', '--cached', '**/*.md']).stdout;

  const geNewFileList = highland.pipeline(
    highland.map(stripMarkdown),
    highland.map(removeNewLign)
  );
  return highland
    .concat(
      getNewFileContent(gitStatusShortSummaryStream, readFile),
      getDiffContentStream(gitDiffStream)
    )
    .pipe(geNewFileList)
    .collect()
    .toPromise(Promise);
};

module.exports = {
  getNewlyInsertedText,
  getDiffContentStream,
};
