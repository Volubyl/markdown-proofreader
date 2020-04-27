const { isGitInsert, isNewFile } = require('../utils');

describe('Utils', () => {
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

  describe('isNewFile', () => {
    it('should  return true if the file is new', () => {
      const rawPath = 'A  src/__test__/fixtures/testfile2.md';
      expect(isNewFile(rawPath)).toBe(true);
    });
    it('should  return false if the file has been modified (not new)', () => {
      const rawPath = 'M  src/__test__/fixtures/testfile2.md';
      expect(isNewFile(rawPath)).toBe(false);
    });
    it('should  return false if the file has been modified (not new) but the file path starts by A', () => {
      const rawPath = 'M  Arc/__test__/fixtures/testfile2.md';
      expect(isNewFile(rawPath)).toBe(false);
    });
  });
});
