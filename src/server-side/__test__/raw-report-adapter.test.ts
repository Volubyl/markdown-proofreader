import { buildRawReport, extractRelevantInfosFromGrammarBotReport, buildReplacementValues } from "../raw-report-adapter"
import { getGrammarBotReport } from "../../common/__fixtures__/grammarBotReport"
import { FileContent } from "../../domain";
import { GrammarBotReport, RelevantInfosExtractor, RawReportFetcher } from "../definition";

describe('RawReportAdapter', () => {
    describe('buildReplacementValue', () => {
        it('should filter the withe space and keep the value', () => {
            const replacements = [
                { value: 'foo' },
                { value: '  bar' },
                { value: 'baz  ' },
                { value: '' },
                { value: '      ' },
            ];

            expect(buildReplacementValues(replacements)).toEqual(['foo', 'bar', 'baz']);
        });
    });
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
                replacements: [proposedReplacementValue],
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
                replacements: [proposedReplacementValue],
            }]

            const result = extractRelevantInfosFromGrammarBotReport(fakeGrammarBotReport);

            expect(result).toEqual(expectedResult)
        });
    });
});
