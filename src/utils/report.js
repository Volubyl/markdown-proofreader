const Grammarbot = require('grammarbot');
const chalk = require('chalk');
const { getNewlyInsertedText } = require('./core');

const { log, error } = console;
const extractRelevantInfosFromCertBotReport = (certbotReport) => {
  const { matches } = certbotReport;

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

const getReport = async (apikey) => {
  const insertedText = await getNewlyInsertedText();

  insertedText.forEach((element) => {
    log(chalk.green(element));
  });

  if (insertedText.length === 0) return [];

  const report = await getGrammarBotReport(insertedText.join('\n'), apikey);

  return extractRelevantInfosFromCertBotReport(report);
};

const formatReplacements = (replacements) =>
  replacements.map((item) => item.value).join(', ');

const formatMessage = (message) =>
  `${chalk.red(String.fromCharCode(10007))} ${chalk.bold(message)}`;

const formatSentence = (sentence) =>
  `${chalk.bold(String.fromCharCode(8227))} Sentence: ${sentence}`;

const formatReport = (report) =>
  report.reduce((prev, current) => {
    const formatedReport = `${formatMessage(current.message)}\n${formatSentence(
      current.sentence
    )}\nPossible replacements: ${formatReplacements(current.replacements)}`;

    if (!prev) {
      return formatedReport;
    }
    return `${prev}\n${formatedReport}`;
  }, '');

const displayReport = (report) => {
  const workingReport = [...report];
  const title = chalk.red.bold('Oh snap we found few typos/grammar errors');

  log(
    `${title}\n\nBut don't worry here is your report:\n${formatReport(
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
  extractRelevantInfosFromCertBotReport,
  getReport,
  displayReport,
  formatReplacements,
  formatMessage,
  formatSentence,
  formatReport,
  displayErrorMessage,
  displaySuccessMessage,
};
