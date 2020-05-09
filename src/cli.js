#!/usr/bin/env node

const { program } = require('commander');

const {
  displaySuccessMessage,
  displayErrorMessage,
  displayReports,
  displayInfoMessage,
} = require('./ui');

const {
  generateReportFromDiffs,
  generateReportForMatchingFiles,
  sanatizeGlob,
} = require('./core');

const generateAndDisplayReport = async (apiKey, onlyDiffs, match) => {
  let report;
  try {
    if (onlyDiffs) {
      report = await generateReportFromDiffs(apiKey);
    } else {
      const sanatizedGlob = sanatizeGlob(match);
      displayInfoMessage(`checking file(s) matching: ${sanatizedGlob}`);
      report = await generateReportForMatchingFiles(apiKey, sanatizedGlob);
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
  )
  .option(
    '--match <glob>',
    'only check files that match the glob. Default value : *.md',
    '*.md'
  );

program.parse(process.argv);

const { key: apiKey, onlyDiffs, match } = program;

generateAndDisplayReport(apiKey, onlyDiffs, match);
