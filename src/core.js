const { spawn } = require('child_process');
const isNodeStream = require('is-stream');
const highland = require('highland');
const remark = require('remark');
const strip = require('strip-markdown');
const fs = require('fs');
const fg = require('fast-glob');
const Grammarbot = require('grammarbot');

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

const isMarkdownGlob = (glob) => {
  return ['{md}', 'md'].includes(glob.split('.').pop());
};

// it's just a little layer of security to avoid reading non-markdown files.
// Real security is done by cleaning up the markdown afterwards
const sanatizeGlob = (glob) => {
  if (isMarkdownGlob(glob)) {
    return glob;
  }

  return `${glob}.md`;
};

const getMarkdownFilePaths = async (glob) => {
  return fg(sanatizeGlob(glob), {
    ignore: 'node_modules',
  });
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

const getContentFromMarkdownFiles = async (glob) => {
  const filesPaths = await getMarkdownFilePaths(glob);
  const contents = await getContentFromFiles(getContentFromFiles);
  return [filesPaths, contents];
};

const linkReporttAndFilePath = (contents, filesPaths) => {
  const reducer = (previous, current, index) => {
    return {
      ...previous,
      // I rather like to have null instead of undefined.
      // Null is more like "there is no value on purpose'
      [current]: contents[index] || null,
    };
  };
  return filesPaths.reduce(reducer, {});
};

const extractRelevantInfosFromGrammarBotReport = (grammarBotReport) => {
  const { matches } = grammarBotReport;

  return matches.map(({ message, replacements, sentence }) => {
    return {
      message,
      replacements,
      sentence,
    };
  });
};

const getGrammarBotReport = async (rawContent, apikey) => {
  const bot = new Grammarbot({
    api_key: apikey,
  });

  return bot.checkAsync(rawContent);
};

const generateReportFromDiffs = async (apikey) => {
  const insertedText = await getContentForNewAndModifiedFiles();

  if (insertedText.length === 0) return [];

  const grammarBotReport = await getGrammarBotReport(
    insertedText.join('\n'),
    apikey
  );

  const shortenendReport = extractRelevantInfosFromGrammarBotReport(
    grammarBotReport
  );

  return linkReporttAndFilePath(
    [shortenendReport],
    // currently the diffs are coming from various files.
    // This will be displayed in the terminal :
    ['From various source file']
  );
};

// this function only exists to allow dependency injection mostly for testing purpose
// it's a nice alternative to mocking because
// - Would be cool to avoid XHR call while testing
// - Would be also nice to make dependencies with side effects more predicatble

const partialGenerateReportForMatchingFiles = (
  sendContentToGrammarBot,
  fileContentReader
) => async (apikey, glob) => {
  if (typeof sendContentToGrammarBot !== 'function') {
    throw new Error('"sendContentToGrammarBot" is not a valid function');
  }
  if (typeof fileContentReader !== 'function') {
    throw new Error('"fileContentReader" is not a valid function');
  }

  const [filePaths, fileContents] = await fileContentReader(glob);

  if (fileContents.length === 0) return linkReporttAndFilePath([], filePaths);

  const plannedGrammarBotCall = fileContents.map((content) =>
    sendContentToGrammarBot(content, apikey)
  );

  const grammarBotReports = await Promise.all(plannedGrammarBotCall);

  const shortenedReports = grammarBotReports.map(
    extractRelevantInfosFromGrammarBotReport
  );

  return linkReporttAndFilePath(shortenedReports, filePaths);
};

module.exports = {
  getContentForNewAndModifiedFiles,
  getMarkdownFilePaths,
  isGitInsert,
  isMarkdownGlob,
  sanatizeGlob,
  generateReportFromDiffs,
  partialGenerateReportForMatchingFiles,
  generateReportForMatchingFiles: partialGenerateReportForMatchingFiles(
    getGrammarBotReport,
    getContentFromMarkdownFiles
  ),
  extractRelevantInfosFromGrammarBotReport,
  linkReporttAndFilePath,
  getCleanContentPipleLine,
  getContentFromFiles,
  getDiffContentStream,
};
