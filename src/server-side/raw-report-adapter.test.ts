import { buildRawReport, extractRelevantInfosFromGrammarBotReport } from "./raw-report-adapter"
import { getGrammarBotReport } from "../../__test__/fixtures/grammarBotReport"
import { FileContent } from "../domain";
import { GrammarBotReport, RelevantInfosExtractor, RawReportFetcher } from "./definition";

describe('RawReportAdapter', () => {
    describe('buildRawReport', () => {
        it('should fetch and build some RawGrammarAndOrthographReportItem', async () => {
            const message = "A nice message";
            const sentence = "A nice sentence";
            const proposedReplacementValue = "a nice replacement value"
            const fakeFileContent = "fake file content"
            const fakeGrammarBotReport = getGrammarBotReport(message, sentence, proposedReplacementValue);

            const expectedResult = [{
                message,
                sentence,
                replacements: [{ value: proposedReplacementValue }],
            }]

            const fakeFetchRawReport: RawReportFetcher = (fileContent: FileContent) => {
                expect(fileContent).toBe(fakeFileContent)
                return Promise.resolve(fakeGrammarBotReport);
            }

            const fakeRelevantInfosExtractor: RelevantInfosExtractor = (gammarBotReport: GrammarBotReport) => {
                expect(gammarBotReport).toEqual(fakeGrammarBotReport);
                return expectedResult
            }

            const result = await buildRawReport(fakeFetchRawReport, fakeRelevantInfosExtractor, fakeFileContent)

            expect(result).toEqual(expectedResult)
        });
    });

    describe('extractRelevantInfosFromGrammarBotReport', () => {
        it('should return the relevant infos form a grammarBotReport', async () => {
            const message = "A nice message";
            const sentence = "A nice sentence";
            const proposedReplacementValue = "a nice replacement value"
            const fakeGrammarBotReport = getGrammarBotReport(message, sentence, proposedReplacementValue);

            const expectedResult = [{
                message,
                sentence,
                replacements: [{ value: proposedReplacementValue }],
            }]

            const result = extractRelevantInfosFromGrammarBotReport(fakeGrammarBotReport);

            expect(result).toEqual(expectedResult)
        });
    });
});
