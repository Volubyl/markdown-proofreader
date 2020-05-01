const Grammarbot = require('grammarbot');
const chalk = require('chalk');
const { getNewlyInsertedText } = require('./core');

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

const generateReport = async (apikey) => {
  const insertedText = await getNewlyInsertedText();

  if (insertedText.length === 0) return [];

  const report = await getGrammarBotReport(insertedText.join('\n'), apikey);

  return extractRelevantInfosFromGrammarBotReport(report);
};

const formatReplacements = (replacements) =>
  replacements.map((item) => item.value).join(', ');

const formatMessage = (message) =>
  `${chalk.red(String.fromCharCode(10007))} ${chalk.bold(message)}`;

const formatSentence = (sentence) =>
  `${chalk.bold(String.fromCharCode(8227))} Sentence: ${sentence}`;

const formatReport = (report) =>
  `${formatMessage(report.message)}\n${formatSentence(
    report.sentence
  )}\n\n${chalk.underline('Possible replacements:')} ${formatReplacements(
    report.replacements
  )}`;

const reduceReport = (report) =>
  report.reduce((prev, current) => {
    if (!prev) {
      return formatReport(current);
    }
    return `${prev}\n\n${formatReport(current)}`;
  }, '');

const displayReport = (report) => {
  const workingReport = [...report];
  const title = chalk.red.bold('Oh snap we found few typos/grammar errors');

  log(
    `${title}\n\nBut don't worry here is your report:\n\n${reduceReport(
      workingReport
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
  generateReport,
  displayReport,
  formatReplacements,
  formatMessage,
  formatSentence,
  reduceReport,
  displayErrorMessage,
  displaySuccessMessage,
};
