const { isGitInsert, getOnlyInserts } = require('../utils');

describe('Utils', () => {
  describe('selectOnlyInserts', () => {
    it('should return false if the string is not a git insert', () => {
      const rawString = "I'm only a raw string";
      expect(isGitInsert(rawString)).toBe(false);
    });

    it('should return false if the string is not a git insert -- funky string case', () => {
      const rawString = "@@ +I'm only a raw string";
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
  });

  describe('getOnlyInserts', () => {
    it('should return only the git inserts', () => {
      const rawString = `
          Hello
          +Hello
          --Hellow
          + Hello world
        `;

      const expectedResult = 'Hello\nHello world';
      expect(getOnlyInserts(rawString)).toEqual(expectedResult);
    });

    it('should return only the git inserts -- works also with single string', () => {
      const rawString = '+hello';

      const expectedResult = 'hello';
      expect(getOnlyInserts(rawString)).toEqual(expectedResult);
    });
  });
});
