import {
  ProofReadingReport, GenerateProofReadingReport, FileContent, GetRawGrammarAndOrthographReport, FilePath, RawGrammarAndOrthographReportItem,
} from './definition';

const fetchReportForEachContent = (fileContents: Array<FileContent>, getRawGrammarAndOrthographReport: GetRawGrammarAndOrthographReport): Promise<Array<Array<RawGrammarAndOrthographReportItem>>> => {
  const plannedAPICalls = fileContents.map((fileContent) => getRawGrammarAndOrthographReport(fileContent));
  return Promise.all(plannedAPICalls);
}

export const buildProofReadingReport = (rawReports: Array<Array<RawGrammarAndOrthographReportItem>>, filesPaths: Array<FilePath>) => filesPaths.reduce((previous, current, index) => ({
  ...previous,
  [current]: rawReports[index] || [],
}), {});

export const generateProofReadingReport: GenerateProofReadingReport = (getContentFromFiles, getGrammarAndOrthographReport) => async (
  glob: string,
): Promise<ProofReadingReport> => {
  const [filesPaths, fileContents] = await getContentFromFiles(glob);

  if (fileContents.length === 0) {
    return buildProofReadingReport([], filesPaths)
  }

  const rapportForEachContent = await fetchReportForEachContent(fileContents, getGrammarAndOrthographReport);

  return buildProofReadingReport(rapportForEachContent, filesPaths)
}

export default generateProofReadingReport
