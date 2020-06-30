const chalk = require('chalk');

const { log, error } = console;
const {EOL} = require("os");

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
  const baseReport = `${formatMessage(report.message)}${EOL}${EOL}${formatSentence(
    report.sentence
  )}`;

  const filtredReplacement = filterReplacement(report.replacements);

  if (filtredReplacement.length === 0) return baseReport;

  return `${baseReport}${EOL}${EOL}${chalk.underline(
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
    return `${prev}${EOL}${EOL}${formatReport(current)}`;
  }, '');

const makeMultipleReportDislayable = (reports) => {
  const keys = Object.keys(reports);

  return keys.reduce((prev, filePath) => {
    const workingReport = makeOneReportDisplayable(reports[filePath]);
    const finalReport =
      workingReport || formatSuccessMessage('No mistake found here');

    const formattedFilePath = formatFilePath(filePath);

    if (!prev) {
      return `${formattedFilePath}${EOL}${EOL}${finalReport}`;
    }
    return `${prev}${EOL}${EOL}${formattedFilePath}${EOL}${EOL}${finalReport}`;
  }, '');
};

const displayReports = (reports) => {
  const workingReports = { ...reports };

  const title = "We've checked your files. Here is what we found :";

  log(
    `${chalk.bold(title)}${EOL}${EOL}${makeMultipleReportDislayable(workingReports)}`
  );
};

const displaySuccessMessage = () =>
  log(formatSuccessMessage('Allright! No mistake found, My Capitain'));

const displayErrorMessage = (e) => {
  log(chalk.red.bold(`Oh snap something went wrong :`));
  error(e);
};

const displayInfoMessage = (message) => log(chalk.bold(`${EOL}${message}${EOL}`));

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
