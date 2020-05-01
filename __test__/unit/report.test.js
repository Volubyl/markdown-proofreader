const chalk = require('chalk');
const { getReport } = require('../fixtures/report');
const getGrammarBotReport = require('../fixtures/grammarBotReport');
const {
  extractRelevantInfosFromGrammarBotReport,
  formatReplacements,
  formatMessage,
  reduceReport,
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

      const expectedResut = getReport(
        message,
        sentence,
        proposedReplacementValue
      );
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

    it('should format the report to be displayable', () => {
      const message = 'A nice message with typos';
      const sentence = 'Their is a mistake here';
      const replacementValue = 'there';
      const report = getReport(message, sentence, replacementValue)[0];

      // This is a very naive and not really maintenable way to test the UI
      // Here snapshot seems to be useless maybe should I do something like here
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

      expect(reduceReport([report])).toBe(expectedResult);
    });

    it('should format the report to be displayable -- no available replacement', () => {
      const message = 'A nice message with typos';
      const sentence = 'Their is a mistake here';

      const report = getReport(message, sentence)[0];

      // This is a very naive and not really maintenable way to test the UI
      // Here snapshot seems to be useless maybe should I do something like here
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

      expect(reduceReport([report])).toBe(expectedResult);
    });
  });
});
