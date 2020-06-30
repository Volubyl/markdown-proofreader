const chalk = require('chalk');
const { getReport, getReports } = require('../fixtures/report');
const {EOL} = require("os");
const {
  formatReplacements,
  formatMessage,
  makeOneReportDisplayable,
  makeMultipleReportDislayable,
  formatSentence,
  filterReplacement,
} = require('../../src/ui');

describe('Report', () => {
  describe('Format Content', () => {
    it('should format replacement values to be displayable', () => {
      const value1 = 'there';
      const value2 = 'is';

      const replacements = [value1, value2];

      expect(formatReplacements(replacements)).toBe(`${value1}, ${value2}`);
    });

    it('should format replacement values to be displayable -- one replacement case', () => {
      const value1 = 'there';

      const replacements = [value1];

      expect(formatReplacements(replacements)).toBe(`${value1}`);
    });

    it('should filter the withe space and keep the value', () => {
      const replacements = [
        { value: 'foo' },
        { value: '' },
        { value: '      ' },
      ];

      expect(filterReplacement(replacements)).toEqual(['foo']);
    });

    it('should format message to be displayable', () => {
      const message = 'Hello COVID-19';
      expect(formatMessage(message)).toBe(
        `${chalk.red(String.fromCharCode(10007))} ${chalk.bold(message)}`
      );
    });

    it('should format sentence to be displayable', () => {
      const sentence = 'Hello COVID-19';
      expect(formatSentence(sentence)).toBe(
        `${chalk.bold(String.fromCharCode(8227))} ${chalk.bold(
          'Sentence:'
        )} ${sentence}`
      );
    });
  });

  describe('Make Reports Displayable', () => {
    it('should format a single report to be displayable', () => {
      const message = 'A nice message with typos';
      const sentence = 'Their is a mistake here';
      const replacementValue = 'there';
      const report = getReport({ message, sentence, replacementValue }, 1)[0];

      // This is a very naive and not really maintenable way to test the UI
      // Here snapshot testing seems to be useless maybe should I do something like here
      // https://github.com/chalk/chalk/blob/master/test/chalk.js

      // Should look like this
      // ✗ A nice message with typos
      // ‣ Sentence: Their is a mistake here
      //
      // Possible replacements: there

      const expectedResult = `${chalk.red(
        String.fromCharCode(10007)
      )} ${chalk.bold(message)}${EOL}${EOL}${chalk.bold(
        String.fromCharCode(8227)
      )} ${chalk.bold('Sentence:')} ${sentence}${EOL}${EOL}${chalk.underline(
        'Possible replacements:'
      )} ${replacementValue}`;

      expect(makeOneReportDisplayable([report])).toBe(expectedResult);
    });

    it('should format a single report to be displayable -- no available replacement', () => {
      const message = 'A nice message with typos';
      const sentence = 'Their is a mistake here';

      const report = getReport({ message, sentence }, 1)[0];

      // This is a very naive and not really maintenable way to test the UI
      // Here snapshot testing seems to be useless maybe should I do something like here
      // https://github.com/chalk/chalk/blob/master/test/chalk.js

      // Should look like this
      // ✗ A nice message with typos
      // ‣ Sentence: Their is a mistake here
      //
      // Possible replacements: there

      const expectedResult = `${chalk.red(
        String.fromCharCode(10007)
      )} ${chalk.bold(message)}${EOL}${EOL}${chalk.bold(
        String.fromCharCode(8227)
      )} ${chalk.bold('Sentence:')} ${sentence}`;

      expect(makeOneReportDisplayable([report])).toBe(expectedResult);
    });

    it('should format multiple reports to be displayable', () => {
      const message = 'A nice message with typos';
      const sentence = 'Their is a mistake here';
      const replacementValue = 'there';
      const filePath = 'foo.md';

      const message1 = 'A nice message with typos';
      const sentence1 = 'Their is a mistake here';
      const replacementValue1 = 'there number2';
      const filePath1 = 'bar.md';

      const grammarbotReports = getReports([
        { filePath, message, sentence, replacementValue },
        {
          filePath: filePath1,
          message: message1,
          sentence: sentence1,
          replacementValue: replacementValue1,
        },
      ]);

      // This is a very naive and not really maintenable way to test the UI
      // Here snapshot testing seems to be useless maybe should I do something like here
      // https://github.com/chalk/chalk/blob/master/test/chalk.js

      // Should look like this
      //
      // ↠ foo.md
      //
      // ✗ A nice message with typos
      // ‣ Sentence: Their is a mistake here
      //
      // Possible replacements: there
      //
      // ↠ bar.md
      //
      // ✗ A nice message with typos
      // ‣ Sentence: Their is a mistake here
      //
      // Possible replacements: there

      const formatReport = (
        _filePath,
        _sentence,
        _message,
        _replacementValue
      ) =>
        `${chalk.bold.magentaBright(
          `${String.fromCharCode(8608)} File: ${_filePath}`
        )}${EOL}${EOL}${chalk.red(String.fromCharCode(10007))} ${chalk.bold(
          _message
        )}${EOL}${EOL}${chalk.bold(String.fromCharCode(8227))} ${chalk.bold(
          'Sentence:'
        )} ${_sentence}${EOL}${EOL}${chalk.underline(
          'Possible replacements:'
        )} ${_replacementValue}`;

      const expectedResult = `${formatReport(
        filePath,
        sentence,
        message,
        replacementValue
      )}${EOL}${EOL}${formatReport(filePath1, sentence1, message1, replacementValue1)}`;
      const result = makeMultipleReportDislayable(grammarbotReports);

      expect(result).toEqual(expectedResult);
    });
  });
});
