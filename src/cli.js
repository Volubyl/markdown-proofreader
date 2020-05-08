#!/usr/bin/env node

const { program } = require('commander');

const {
  displaySuccessMessage,
  displayErrorMessage,
  displayReports,
} = require('./ui');

const {
  generateReportFromDiffs,
  generateReportForMatchingFiles,
} = require('./core');

const generateAndDisplayReport = async (apiKey, onlyDiffs) => {
  let report;
  try {
    if (onlyDiffs) {
      report = await generateReportFromDiffs(apiKey);
    } else {
      report = await generateReportForMatchingFiles(apiKey);
    }
    if (report.length === 0) {
      displaySuccessMessage();
      process.exit(0);
    }
    displayReports(report);
    process.exit(0);
  } catch (e) {
    displayErrorMessage(e);
    process.exit(1);
  }
};

program
  .name('markdownproofreader')
  .version('0.O.1')
  .requiredOption('-key, --API_KEY <key>', 'a valid grammar bot key')
  .option(
    '--only-diffs',
    'will only check the diff from the previous commit. Default to false',
    false
  );

program.parse(process.argv);

const { key: apiKey, onlyDiffs } = program;

generateAndDisplayReport(apiKey, onlyDiffs);
