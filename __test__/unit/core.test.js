const { Readable } = require('stream');
const highland = require('highland');
const {
  getDiffContentStream,
  isGitInsert,
  getCleanContentPipleLine,
  getContentFromFiles,
  linkContentAndFilePath,
} = require('../../src/core');

const { getFixtureFolderPath } = require('../utils');

describe('core', () => {
  describe('selectOnlyInserts', () => {
    it('should return false if the string is not a git insert', () => {
      const rawString = "I'm only a raw string";
      expect(isGitInsert(rawString)).toBe(false);
    });

    it('should return false if the string is not a git insert -- funky string case', () => {
      const rawString = "@@ -+##I'm only a raw string";
      expect(isGitInsert(rawString)).toBe(false);
    });

    it('should return false if the string is not a git insert -- ++ case', () => {
      const rawString = "++I'm a git insert";
      expect(isGitInsert(rawString)).toBe(false);
    });

    it('should return true if the string is a git insert', () => {
      const rawString = "+I'm a git insert";
      expect(isGitInsert(rawString)).toBe(true);
    });
    it('should return true if the string is a git insert with space', () => {
      const rawString = "+ I'm a git insert";
      expect(isGitInsert(rawString)).toBe(true);
    });

    it('should return true if the string is a git insert with multiple white space', () => {
      const rawString = "+     I'm a git insert";
      expect(isGitInsert(rawString)).toBe(true);
    });
    it('should return true if the string is a git insert with markdown', () => {
      const rawString = "+## I'm a  markdown string";
      expect(isGitInsert(rawString)).toBe(true);
    });
  });

  describe('getDiffContentStream', () => {
    it('should return the inserted lines only ', async () => {
      const insertWithMarkdown = "### I'm an insert with markdown";
      const insertWithoutMarkdown = "I'm an insert without markdown";
      const insertWithSpaces = "I'm an insert with a space";

      const deletionWithoutMarkdown = "-I'm not an insert";

      const gitDiff = [
        `+${insertWithMarkdown}`,
        `+${insertWithoutMarkdown}`,
        `-${deletionWithoutMarkdown}`,
        ` + ${insertWithSpaces}`,
      ].join('\n');

      const readableStream = Readable.from(gitDiff);

      const result = await getDiffContentStream(readableStream)
        .collect()
        .toPromise(Promise);

      expect(result).toEqual([
        insertWithMarkdown,
        insertWithoutMarkdown,
        insertWithSpaces,
      ]);
    });

    it('should return an highland stream ', () => {
      const readableStream = Readable.from('foo');
      const stream = getDiffContentStream(readableStream);
      expect(highland.isStream(stream)).toBeTruthy();
    });

    it('should throw an error if an invalid stream provided as input ', () => {
      const invalidStream = 'not a stream';
      expect(() => getDiffContentStream(invalidStream)).toThrow(Error);
    });
  });

  describe('getCleanContentPipleLine', () => {
    it('should remove markdown sign and new line mark', async () => {
      // Here the goal is not to test if we remove all the markdown
      // The library is already tested
      const title = "I'm a markdownText";
      const paragraph = "I'm the secondParagraph";
      const markownContent = [`### ${title}\n`, `${paragraph}`];

      const readableStream = Readable.from(markownContent);
      const result = await highland(readableStream)
        .pipe(getCleanContentPipleLine())
        .collect()
        .toPromise(Promise);

      expect(result).toEqual([title, paragraph]);
    });
  });

  describe('getContentFromFiles', () => {
    it('should remove markdown sign and new line mark', async () => {
      const fixtureFolderPath = getFixtureFolderPath();
      const fakeFilePath = `${fixtureFolderPath}/fakeFiles/simple-file.md`;
      const result = await getContentFromFiles([fakeFilePath]);

      expect(result).toEqual(['A simple test file']);
    });

    it('should also work when no matching file found', async () => {
      const result = await getContentFromFiles([]);

      expect(result).toEqual([]);
    });

    it('should throw an error if file not foumd', async () => {
      const fixtureFolderPath = getFixtureFolderPath();
      const fakeFilePath = `${fixtureFolderPath}/fakeFiles/notExisting.md`;

      expect(() => getContentFromFiles([fakeFilePath])).rejects.toThrow();
    });
  });

  describe('linkContentAndFilePath', () => {
    it('should return an object with content and file name linked', () => {
      const filePath1 = 'src/foo.md';
      const filePath2 = 'src/bar.md';
      const filePaths = [filePath1, filePath2];

      const content1 = "I'm a content";
      const content2 = "I'm a content too";

      const contents = [content1, content2];

      const expectedResult = {
        [filePath1]: content1,
        [filePath2]: content2,
      };
      const result = linkContentAndFilePath(contents, filePaths);
      expect(result).toEqual(expectedResult);
    });
  });
});
