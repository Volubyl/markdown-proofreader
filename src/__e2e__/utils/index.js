const fsExtra = require('fs-extra');
const fs = require('fs');
const { exec, execSync } = require('child_process');

const filePath = './src/fixtures/test-file.md';
const testBranchName = 'e2e-test-branch';

// Outch that's a real nasty side effect here :-(
let currentBranchName;
const getCurrentBranchName = () => {
  currentBranchName = execSync(`git rev-parse --abbrev-ref HEAD`);
  return currentBranchName.toString();
};

const checkoutToTestBranch = () => {
  exec(`git checkout -b ${testBranchName}`);
};

const removeTestBranch = () => {
  exec(`git checkout ${currentBranchName}`);
  exec(`git branch -D  ${testBranchName}`);
};

const commitTestFile = (message) => {
  exec(`git commit -m "${message}"`);
};

const appendTextToTestFile = (content) => {
  fs.appendFileSync(filePath, content);
};

const createTestFile = (content) => {
  fsExtra.createFileSync(filePath);
  appendTextToTestFile(content);
};

const removeTestFiles = () => {
  fs.unlinkSync(filePath);
};

const trackTestFile = () => {
  exec(`git add ${filePath}`);
};

const untrackTestFile = () => {
  exec(`git restore --staged ${filePath}`);
};

const removeFixtureFolder = () => {
  fsExtra.removeSync('./src/fixtures/');
};

module.exports = {
  createTestFile,
  appendTextToTestFile,
  removeTestFiles,
  removeFixtureFolder,
  trackTestFile,
  checkoutToTestBranch,
  commitTestFile,
  removeTestBranch,
  getCurrentBranchName,
  untrackTestFile,
};
