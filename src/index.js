#!/usr/bin/env node

const { program } = require('commander');

const {
  displayReport,
  generateReportForNewAndModifiedFiles,
  displaySuccessMessage,
  displayErrorMessage,
  generateReportForMatchingFiles,
} = require('./report');

const { getContentForMatchingFiles } = require('./core');

const buildAndDisplayReport = async (apiKey, glob) => {
  try {
    let report;
    if (glob) {
      report = await getContentForMatchingFiles(apiKey, glob);
    } else {
      report = await generateReportForNewAndModifiedFiles(apiKey);
    }

    console.log(report);
    process.exit(0);
    if (report.length === 0) {
      displaySuccessMessage();
      process.exit(0);
    }
    displayReport(report);
    process.exit(0);
  } catch (e) {
    displayErrorMessage(e);
    process.exit(1);
  }
};

program
  .name('markdownproofreader')
  .version('0.O.O')
  .requiredOption('-key, --API_KEY <key>', 'a valid grammar bot key');

program.parse(process.argv);

const apiKey = program.key;

buildAndDisplayReport(apiKey);
