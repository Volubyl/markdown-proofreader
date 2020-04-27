const { Readable } = require('stream');
const highland = require('highland');
const { getDiffContentStream } = require('../utils');

describe('core', () => {
  describe('getDiffContentStream', () => {
    it('should return the inserted lines only ', async () => {
      const insertWithMarkdown = "### I'm an insert with markdown";
      const insertWithoutMarkdown = "I'm an insert without markdown";
      const insertWithSpace = " I'm an insert with a space";

      const deletionWithoutMarkdown = "-I'm not an insert";

      const gitDiff = [
        `+${insertWithMarkdown}`,
        `+${insertWithoutMarkdown}`,
        `-${deletionWithoutMarkdown}`,
        `+${insertWithSpace}`,
      ].join('\n');

      const readableStream = Readable.from(gitDiff);

      const result = await getDiffContentStream(readableStream)
        .collect()
        .toPromise(Promise);

      expect(result).toEqual([
        insertWithMarkdown,
        insertWithoutMarkdown,
        insertWithSpace,
      ]);
    });

    it('should return an highland stream ', async () => {
      const readableStream = Readable.from('foo');
      const stream = getDiffContentStream(readableStream);
      expect(highland.isStream(stream)).toBeTruthy();
    });

    it('should throw an error if an invalid stream provided as input ', async () => {
      const invalidStream = 'not a stream';
      expect(() => getDiffContentStream(invalidStream)).toThrow(Error);
    });
  });
});
