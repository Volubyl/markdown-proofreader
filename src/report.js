const Grammarbot = require('grammarbot');
const chalk = require('chalk');
const {
  getContentForNewAndModifiedFiles,
  getMarkdownFilePaths,
  getContentFromFiles,
  linkContentAndFilePath,
} = require('./core');

const { log, error } = console;
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

  return linkContentAndFilePath(
    [shortenendReport],
    // currently the diffs are coming from various files.
    // This will be displayed in the terminal :
    ['From various source file']
  );
};

const generateReportForMatchingFiles = async (apikey) => {
  const filePaths = await getMarkdownFilePaths();
  const fileContents = await getContentFromFiles(filePaths);

  if (fileContents.length === 0) return [];

  const plannedGrammarBotCall = fileContents.map((content) =>
    getGrammarBotReport(content, apikey)
  );

  const grammarBotReports = await Promise.all(plannedGrammarBotCall);

  const shortenedReports = grammarBotReports.map(
    extractRelevantInfosFromGrammarBotReport
  );

  return linkContentAndFilePath(shortenedReports, filePaths);
};

const filterReplacement = (replacements) =>
  replacements
    .map((item) => item.value)
    .map((item) => item.trim())
    .filter((item) => item);

const formatReplacements = (replacements) => {
  if (replacements.length > 0) return replacements.join(', ');
  return replacements[0];
};

const formatMessage = (message) =>
  `${chalk.red(String.fromCharCode(10007))} ${chalk.bold(message)}`;

const formatSentence = (sentence) =>
  `${chalk.bold(String.fromCharCode(8227))} ${chalk.bold(
    'Sentence:'
  )} ${sentence}`;

const formatFilePath = (filepath) =>
  `${String.fromCharCode(8608)} ${filepath} :`;

const formatReport = (report) => {
  const baseReport = `${formatMessage(report.message)}\n\n${formatSentence(
    report.sentence
  )}`;

  const filtredReplacement = filterReplacement(report.replacements);

  if (filtredReplacement.length === 0) return baseReport;

  return `${baseReport}\n\n${chalk.underline(
    'Possible replacements:'
  )} ${formatReplacements(filtredReplacement)}`;
};

const makeOneReportDisplayable = (report) =>
  report.reduce((prev, current) => {
    if (!prev) {
      return formatReport(current);
    }
    return `${prev}\n\n${formatReport(current)}`;
  }, '');

const makeMultipleReportDislayable = (reports) => {
  const keys = Object.keys(reports);

  return keys.reduce((prev, filePath) => {
    const formattedFilePath = formatFilePath(filePath);
    if (!prev) {
      return `${formattedFilePath}\n\n${makeOneReportDisplayable(
        reports[filePath]
      )}`;
    }
    return `${prev}\n\n${formattedFilePath}\n\n${makeOneReportDisplayable(
      reports[filePath]
    )}`;
  }, '');
};

const displayReports = (reports) => {
  const workingReports = { ...reports };
  const title = chalk.red.bold('Oh snap we found few typos/grammar errors');

  log(
    `${title}\n\nBut don't worry here is your report:\n\n${makeMultipleReportDislayable(
      workingReports
    )}`
  );
};

const displaySuccessMessage = () =>
  log(
    chalk.green(
      `${String.fromCharCode(10004)} Allright! No mistake found, My Capitain`
    )
  );
const displayErrorMessage = (e) => {
  log(chalk.red.bold(`Oh snap something went wrong :`));
  error(e);
};

module.exports = {
  extractRelevantInfosFromGrammarBotReport,
  generateReportFromDiffs,
  generateReportForMatchingFiles,
  formatReplacements,
  displayReports,
  formatMessage,
  formatSentence,
  makeMultipleReportDislayable,
  makeOneReportDisplayable,
  filterReplacement,
  displayErrorMessage,
  displaySuccessMessage,
};
