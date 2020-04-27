const { Readable } = require('stream');
const highland = require('highland');
const {
  getDiffContentStream,
  getNewFileContentStream,
  getNewFilePathListPipeline,
} = require('../utils');

describe('core', () => {
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

  describe('getNewFileContentStream', () => {
    it('should throw an error if an invalid stream provided as shortSummaryStream input', () => {
      const invalidStream = 'not a stream';
      expect(() => getNewFileContentStream(invalidStream, null)).toThrow(Error);
    });
    it('should throw an error if an invalid file reader function is provided as argument', () => {
      const readableStream = Readable.from('foo');
      const invalidStream = 'not a stream';
      expect(() =>
        getNewFileContentStream(readableStream, invalidStream)
      ).toThrow(Error);
    });
  });

  describe('getNewFilePathListPipeline', () => {
    it('should return the list of nwe files', async () => {
      const newFilePath = 'src/bar/baz.md';
      const updatedFile = 'src/foo/foo.md';
      const newFilePathWithSpace = 'src/foo/foo.md';

      const gitShortStatus = [
        `A ${newFilePath}`,
        `M ${updatedFile}`,
        ` A ${newFilePathWithSpace} `,
      ].join('\n');

      const result = await highland(Readable.from(gitShortStatus))
        .pipe(getNewFilePathListPipeline())
        .collect()
        .toPromise(Promise);

      expect(result).toEqual([newFilePath, newFilePathWithSpace]);
    });
  });
});
