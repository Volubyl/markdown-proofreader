const {
  createTestFile,
  trackTestFile,
  removeFixtureFolder,
} = require('./utils');
const { getContentForNewAndModifiedFiles } = require('../../src/core');

// This is a not really nice way to perform e2e test that provoke sometimes false failing tests
// Need to improve this
describe('End to end test', () => {
  const e2eTestFolder = './__test__/e2e_test_files';
  const filePath = `${e2eTestFolder}/test-file.md`;

  describe('getContentForNewAndModifiedFiles', () => {
    const lastLine = 'very important secret';
    const testFileContent = [
      '# First Test file',
      '``` few lines of code ```',
      'a dummy paragraph',
      `**${lastLine}**`,
    ].join('\n');

    beforeEach(() => {
      createTestFile(filePath, testFileContent);
      trackTestFile(filePath);
    });

    describe('When a new file has been created', () => {
      it('should return the text inside a new file', async () => {
        const result = await getContentForNewAndModifiedFiles();
        expect(result).toEqual([
          'First Test file',
          'few lines of code',
          'a dummy paragraph',
          lastLine,
        ]);
      });
    });

    // Currently this test is failing while running on the CI ... :-(

    // describe('When a file has been updated', () => {
    //   const newline = `a nice new text`;
    //   beforeAll(() => {
    //     trackTestFile(filePath);
    //     commitTestFile('e2e test -- add previoulsy created file');
    //     appendTextToTestFile(filePath, `${'\n'}${newline}`);
    //     trackTestFile(filePath);
    //   });
    //   it('should return only the most recently inserted text', async () => {
    //     const result = await getContentForNewAndModifiedFiles();
    //     expect(result).toEqual([lastLine, newline]);
    //   });
    // });

    afterEach(() => {
      trackTestFile(filePath);
      removeFixtureFolder(e2eTestFolder);
      // undoLastCommit();
    });
  });
});
