const chalk = require('chalk');
const getReport = require('../fixtures/report');
const getGrammarBotReport = require('../fixtures/grammarBotReport');
const {
  extractRelevantInfosFromCertBotReport,
  formatReplacements,
  formatMessage,
  formatReport,
  formatSentence,
} = require('../../src/report');

describe('Report', () => {
  describe('extractRelevantInfosFromCertBotReport', () => {
    it('should return a report from certBot report', () => {
      const message =
        "Statistics suggests that 'there' (as in 'Is there an answer?') might be the correct word here, not 'their' (as in 'It’s not their fault.'). Please check.";
      const proposedReplacementValue = 'there';

      const sentence = "I can't remember how to go their.";

      const grammarBotReport = getGrammarBotReport(
        message,
        proposedReplacementValue,
        sentence
      );

      const expectedResut = getReport(
        message,
        proposedReplacementValue,
        sentence
      );

      expect(extractRelevantInfosFromCertBotReport(grammarBotReport)).toEqual(
        expectedResut
      );
    });
  });

  describe('Format Content', () => {
    it('should format replacement values to be displayable', () => {
      const value1 = 'there';
      const value2 = 'is';

      const replacements = [{ value: value1 }, { value: value2 }];

      expect(formatReplacements(replacements)).toBe(`${value1}, ${value2}`);
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
      const value = 'there';
      const report = getReport(message, value, sentence)[0];

      // Should look like this
      // ✗ A nice message with typos
      // ‣ Sentence: Their is a mistake here
      // Possible replacements: there

      const expectedResult = `${chalk.red(
        String.fromCharCode(10007)
      )} ${chalk.bold(message)}\n${chalk.bold(
        String.fromCharCode(8227)
      )} Sentence: ${sentence}\nPossible replacements: ${value}`;

      expect(formatReport([report])).toBe(expectedResult);
    });
  });
});
