import { ProofReadingReport, RawGrammarAndOrthographReportItem } from "../../domain/definition"

type ReportData = {
  filePath?: string
  message: string,
  sentence: string,
  replacementValue?: string
}

export const buildFakeRawRawGrammarAndOrthographReport = ({ message, sentence, replacementValue }: ReportData, repetition = 3): Array<RawGrammarAndOrthographReportItem> => {
  const reports = [];

  for (let index = 0; index < repetition; index += 1) {
    reports.push({
      message,
      replacements: replacementValue ? [replacementValue] : [],
      sentence,
    });
  }

  return reports;
};

export const buildFakeProofReadingReport = (rawReports: Array<ReportData>): ProofReadingReport => rawReports.reduce((prev, current) => {
  const {
    filePath, message, replacementValue, sentence,
  } = current;
  return {
    ...prev,
    [filePath]: buildFakeRawRawGrammarAndOrthographReport({ message, sentence, replacementValue }, 1),
  };
}, {});
