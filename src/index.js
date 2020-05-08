#!/usr/bin/env node

const { program } = require('commander');

const {
  displayReport,
  generateReportFromDiffs,
  generateReportForMatchingFiles,
  displaySuccessMessage,
  displayErrorMessage,
  displayReports,
} = require('./report');

const buildAndDisplayReport = async (apiKey, onlyDiffs) => {
  try {
    if (onlyDiffs) {
      const report = generateReportFromDiffs(apiKey);

      if (report.length === 0) {
        displaySuccessMessage();
        process.exit(0);
      }

      displayReport(report);
      process.exit(0);
    }

    const reports = await generateReportForMatchingFiles(apiKey);
    if (reports.length === 0) {
      displaySuccessMessage();
      process.exit(0);
    }
    displayReports(reports);
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

buildAndDisplayReport(apiKey, onlyDiffs);
