const { program } = require('commander');

const {
  displayReport,
  getReport,
  displaySuccessMessage,
  displayErrorMessage,
} = require('./utils/report');

const buildAndDisplayReport = async (apiKey) => {
  try {
    const report = await getReport(apiKey);
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
  .name('markdown-proofreader')
  .version('0.O.O')
  .requiredOption('-key, --API_KEY <key>', 'a valid grammar bot key');

program.parse(process.argv);

const apiKey = program.key;

buildAndDisplayReport(apiKey);
