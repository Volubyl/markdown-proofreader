#!/usr/bin/env node

const { program } = require('commander');

const {
  displayErrorMessage,
  displayReports,
  displayInfoMessage,
} = require('./ui');

const {
  generateReportFromDiffs,
  generateReportForMatchingMarkdownFiles,
  sanatizeGlob,
} = require('./core');

const generateAndDisplayReport = async (onlyDiffs, match) => {
  let report;
  try {
    if (onlyDiffs) {
      report = await generateReportFromDiffs();
    } else {
      const sanatizedGlob = sanatizeGlob(match);
      displayInfoMessage(`checking file(s) matching: ${sanatizedGlob}`);

      report = await generateReportForMatchingMarkdownFiles(sanatizedGlob);
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

const { onlyDiffs, match } = program;

generateAndDisplayReport(onlyDiffs, match);
