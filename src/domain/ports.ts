import R from "ramda"
import {
  ProofReadingReport, GenerateProofReadingReport, FileContent, GetRawGrammarAndOrthographReport, FilePath, RawGrammarAndOrthographReportItem, Glob,
} from './definition';

const fetchReportForEachContent = (fileContents: Array<FileContent>, getRawGrammarAndOrthographReport: GetRawGrammarAndOrthographReport): Promise<Array<Array<RawGrammarAndOrthographReportItem>>> => {
  const plannedAPICalls = fileContents.map((fileContent) => getRawGrammarAndOrthographReport(fileContent));
  return Promise.all(plannedAPICalls);
}

export const buildProofReadingReport = (rawReports: Array<Array<RawGrammarAndOrthographReportItem>>, filesPaths: Array<FilePath>): ProofReadingReport => filesPaths.reduce((previous, current, index) => ({
  ...previous,
  [current]: rawReports[index] || [],
}), {});

export const generateProofReadingReport: GenerateProofReadingReport = async (getDraftContent, getGrammarAndOrthographReport, glob?: Glob): Promise<ProofReadingReport> => {
  const [filesPaths, fileContents] = await getDraftContent(glob);

  if (fileContents.length === 0) {
    return buildProofReadingReport([], filesPaths)
  }

  const rapportForEachContent = await fetchReportForEachContent(fileContents, getGrammarAndOrthographReport);

  return buildProofReadingReport(rapportForEachContent, filesPaths)
}

export default generateProofReadingReport
