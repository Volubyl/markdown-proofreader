const { spawn } = require('child_process');
const isNodeStream = require('is-stream');
const highland = require('highland');
const fetch = require('node-fetch');
const {
  isGitInsert,
  removeGitInsertSign,
  stripMarkdown,
  trim,
  removeNewLign,
} = require('./helpers');

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

  const geNewFileList = highland.pipeline(
    highland.map(stripMarkdown),
    highland.map(removeNewLign)
  );

  return getDiffContentStream(gitDiffStream)
    .pipe(geNewFileList)
    .collect()
    .toPromise(Promise);
};

const getGrammarBotReport = async (rawContent) => {
  const report = await fetch('http://api.grammarbot.io/v2/check', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: 'KS9C5N3Y',
      language: 'en_US',
      text: rawContent,
    }),
  });

  return report.json();
};

const getReport = async () => {
  const insertedText = getNewlyInsertedText().join('\n');
  const report = getGrammarBotReport(insertedText);
  console.log(report);
};

module.exports = {
  getNewlyInsertedText,
  getDiffContentStream,
  getReport,
};
