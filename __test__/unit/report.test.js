const chalk = require('chalk');
const { getReport, getReports } = require('../fixtures/report');
const getGrammarBotReport = require('../fixtures/grammarBotReport');
const {
  extractRelevantInfosFromGrammarBotReport,
  formatReplacements,
  formatMessage,
  makeReportDisplayable,
  makeReporstDisplayable,
  formatSentence,
  filterReplacement,
} = require('../../src/report');

describe('Report', () => {
  describe('extractRelevantInfosFromGrammarBotReport', () => {
    it('should return a report from grammarbot report', () => {
      const message =
        "Statistics suggests that 'there' (as in 'Is there an answer?') might be the correct word here, not 'their' (as in 'It’s not their fault.'). Please check.";
      const proposedReplacementValue = 'there';

      const sentence = "I can't remember how to go their.";

      const grammarBotReport = getGrammarBotReport(
        message,
        sentence,
        proposedReplacementValue
      );

      const expectedResut = getReport({
        message,
        sentence,
        replacementValue: proposedReplacementValue,
      });
      const result = extractRelevantInfosFromGrammarBotReport(grammarBotReport);
      expect(result).toEqual(expectedResut);
    });
  });

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
        `${chalk.bold(String.fromCharCode(8227))} Sentence: ${sentence}`
      );
    });
  });

  describe('Make Report yDisplayable', () => {
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
      )} ${chalk.bold(message)}\n${chalk.bold(
        String.fromCharCode(8227)
      )} Sentence: ${sentence}\n\n${chalk.underline(
        'Possible replacements:'
      )} ${replacementValue}`;

      expect(makeReportDisplayable([report])).toBe(expectedResult);
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
      )} ${chalk.bold(message)}\n${chalk.bold(
        String.fromCharCode(8227)
      )} Sentence: ${sentence}`;

      expect(makeReportDisplayable([report])).toBe(expectedResult);
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

      const formattedReport = `${filePath}\n\n${chalk.red(
        String.fromCharCode(10007)
      )} ${chalk.bold(message)}\n${chalk.bold(
        String.fromCharCode(8227)
      )} Sentence: ${sentence}\n\n${chalk.underline(
        'Possible replacements:'
      )} ${replacementValue}`;

      const formattedReport1 = `${filePath1}\n\n${chalk.red(
        String.fromCharCode(10007)
      )} ${chalk.bold(message1)}\n${chalk.bold(
        String.fromCharCode(8227)
      )} Sentence: ${sentence1}\n\n${chalk.underline(
        'Possible replacements:'
      )} ${replacementValue1}`;

      const expectedResult = `${formattedReport}\n\n${formattedReport1}`;
      const result = makeReporstDisplayable(grammarbotReports);

      expect(result).toEqual(expectedResult);
    });
  });
});
