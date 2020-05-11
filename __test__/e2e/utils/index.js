const fsExtra = require('fs-extra');
const fs = require('fs');
const { exec, execSync } = require('child_process');

const commitTestFile = (message) => {
  exec(`git commit -m "${message}"`);
};

const appendTextToTestFile = (filePath, content) => {
  fs.appendFileSync(filePath, content);
};

const createTestFile = (filePath, content) => {
  fsExtra.createFileSync(filePath);
  appendTextToTestFile(filePath, content);
};

const removeTestFiles = (filePath) => {
  fs.unlinkSync(filePath);
};

const trackTestFile = (filePath) => {
  exec(`git add ${filePath}`);
};

const untrackTestFile = (filePath) => {
  exec(`git restore --staged ${filePath}`);
};

const removeFixtureFolder = (e2eTestFolder) => {
  fsExtra.removeSync(e2eTestFolder);
};

const undoLastCommit = () => {
  exec('git reset --hard HEAD~1');
};

const preventTestIfSomethingOnGoing = () => {
  const diffs = execSync(`git diff`).toString();

  if (diffs.length > 0) {
    throw new Error('Please commit your changes before launching e2e tests');
  }
};

module.exports = {
  createTestFile,
  appendTextToTestFile,
  removeTestFiles,
  removeFixtureFolder,
  trackTestFile,
  preventTestIfSomethingOnGoing,
  undoLastCommit,
  commitTestFile,
  untrackTestFile,
};
