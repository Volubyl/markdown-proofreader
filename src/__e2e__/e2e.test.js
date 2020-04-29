const {
  checkoutToTestBranch,
  createTestFile,
  trackTestFile,
  removeFixtureFolder,
  removeTestBranch,
  appendTextToTestFile,
  getCurrentBranchName,
  commitTestFile,
} = require('./utils');
const { getNewlyInsertedText } = require('../utils/core');

describe('End to end test', () => {
  describe('getNewlyInsertedText', () => {
    beforeAll(() => {
      getCurrentBranchName();
      checkoutToTestBranch();
    });

    const lastLine = 'very important secret';

    describe('When a new file has been created', () => {
      const testFileContent = [
        '# First Test file',
        '``` few lines of code ```',
        'a dummy paragraph',
        `**${lastLine}**`,
      ].join('\n');

      beforeAll(() => {
        createTestFile(testFileContent);
        trackTestFile();
      });

      it('should return the text inside a new file', async () => {
        const result = await getNewlyInsertedText();
        expect(result).toEqual([
          'First Test file',
          'few lines of code',
          'a dummy paragraph',
          lastLine,
        ]);
      });
    });

    describe('When a file has been updated', () => {
      const newline = `a nice new text`;
      beforeAll(() => {
        commitTestFile('e2e test -- add previoulsy created file');
        appendTextToTestFile(`${'\n'}${newline}`);
        trackTestFile();
      });
      it('should return only the most recently inserted text', async () => {
        const result = await getNewlyInsertedText();
        expect(result).toEqual([lastLine, newline]);
      });
    });

    afterAll(() => {
      trackTestFile();
      removeFixtureFolder();
      removeTestBranch();
    });
  });
});
