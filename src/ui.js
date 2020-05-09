const chalk = require('chalk');

const { log, error } = console;

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
  chalk.bold.magentaBright(`${String.fromCharCode(8608)} File: ${filepath}`);

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

const formatSuccessMessage = (successMessage) =>
  chalk.green(`${String.fromCharCode(10004)} ${successMessage}`);

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
    const displayableReport = makeOneReportDisplayable(reports[filePath]);
    const finalReport =
      displayableReport ||
      formatSuccessMessage('No mistake found in this file');

    const formattedFilePath = formatFilePath(filePath);

    if (!prev) {
      return `${formattedFilePath}\n\n${finalReport}`;
    }
    return `${prev}\n\n${formattedFilePath}\n\n${finalReport}`;
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
  log(formatSuccessMessage('Allright! No mistake found, My Capitain'));

const displayErrorMessage = (e) => {
  log(chalk.red.bold(`Oh snap something went wrong :`));
  error(e);
};

const displayInfoMessage = (message) => log(chalk.bold(`\n${message}\n`));

module.exports = {
  formatReplacements,
  displayReports,
  formatMessage,
  formatSentence,
  makeMultipleReportDislayable,
  makeOneReportDisplayable,
  filterReplacement,
  displayErrorMessage,
  displayInfoMessage,
  displaySuccessMessage,
};
