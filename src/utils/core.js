const { spawn } = require('child_process');
const isNodeStream = require('is-stream');
const highland = require('highland');
const remark = require('remark');
const strip = require('strip-markdown');

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

const getNewlyInsertedText = () => {
  const gitDiffStream = spawn('git', ['diff', '--cached', '**/*.md']).stdout;

  const newFileListPipeline = highland.pipeline(
    highland.map(stripMarkdown),
    highland.map(removeNewLign)
  );

  return getDiffContentStream(gitDiffStream)
    .pipe(newFileListPipeline)
    .collect()
    .toPromise(Promise);
};

module.exports = {
  getNewlyInsertedText,
  isGitInsert,
  getDiffContentStream,
};
