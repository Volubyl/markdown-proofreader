const { spawn } = require('child_process');
const isNodeStream = require('is-stream');
const highland = require('highland');
const remark = require('remark');
const strip = require('strip-markdown');
const fs = require('fs');
const fg = require('fast-glob');
const path = require('path');

// We are only intersted by strings beginning by '+' and not by those beginning by '++'
const isGitInsert = (input) => /^\+[^+]/.test(input);

// Git prepend the inserted lines with a '+' sign
const removeGitInsertSign = (input) => input.replace('+', '');

// Proofreading APIs have a quota limited in number of characters.
// We only want to check the content not the markdown layout
const stripMarkdown = (markdownText) => {
  let data;
  remark()
    .use(strip)
    .process(markdownText, (err, cleanData) => {
      if (err) throw err;
      data = cleanData;
    });

  return String(data);
};

const trim = (x) => x.trim();
const removeNewLign = (x) => x.replace('\n', '');

// const getNewFilePathListPipeline = () =>
//   highland.pipeline(
//     highland.split(),
//     highland.map(trim),
//     highland.filter(isNewFile),
//     highland.map(replaceGitStatusSign),
//     highland.map(trim)
//   );

// const getFileContent = (shortSummaryStream) => {
//   if (!isNodeStream(shortSummaryStream))
//     throw new Error('Invalid ShortSummary stream provided');

//   const readFileWrapper = highland.wrapCallback(readFile);

//   return highland(shortSummaryStream)
//     .pipe(getNewFilePathListPipeline())
//     .map(readFileWrapper)
//     .parallel(3)
//     .split();
// };

const getCleanContentPipleLine = () => {
  return highland.pipeline(
    highland.map(stripMarkdown),
    highland.map(removeNewLign)
  );
};

const getDiffContentStream = (gitDiffStream) => {
  if (!isNodeStream(gitDiffStream)) throw new Error('Invalid stream provided');

  const cleanDiffContent = highland.pipeline(
    highland.split(),
    highland.map(trim),
    highland.filter(isGitInsert),
    highland.map(removeGitInsertSign),
    highland.map(trim)
  );

  return highland(gitDiffStream).pipe(cleanDiffContent);
};

const getContentForNewAndModifiedFiles = () => {
  const gitDiffStream = spawn('git', ['diff', '--cached', '*.md']).stdout;
  return getDiffContentStream(gitDiffStream)
    .pipe(getCleanContentPipleLine())
    .collect()
    .toPromise(Promise);
};

const getMarkdownFilePaths = async () => {
  return fg('**/*.md', { ignore: 'node_modules' });
};

const getContentFromFiles = (filesPaths) => {
  const readFile = highland.wrapCallback(fs.readFile);
  return highland(filesPaths)
    .map(readFile)
    .stopOnError((err) => {
      throw new Error(err);
    })
    .series()
    .map(String)
    .pipe(getCleanContentPipleLine())
    .collect()
    .toPromise(Promise);
};

const linkContentAndFilePath = (contents, filesPaths) => {
  const reducer = (previous, current, index) => {
    return {
      ...previous,
      [current]: contents[index],
    };
  };
  return filesPaths.reduce(reducer, {});
};

module.exports = {
  getContentForNewAndModifiedFiles,
  getMarkdownFilePaths,
  isGitInsert,
  linkContentAndFilePath,
  getCleanContentPipleLine,
  getContentFromFiles,
  getDiffContentStream,
};
