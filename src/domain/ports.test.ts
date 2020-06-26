import {
    generateProofReadingReport, buildProofReadingReport,
} from "./ports"

import {
    FilePathAndContentTuple, Glob, FileContent, ProofReadingReport,
} from "./definition"

import { buildFakeProofReadingReport, buildFakeRawRawGrammarAndOrthographReport } from "../../__test__/fixtures/report"

describe('Domain -- Ports', () => {
    describe('generateProofReadingReport', () => {
        it('should return a complete proofreading report', async () => {
            const filePath = "foo.md";
            const fileContent = "I'm some content";
            const replacementValue = "A nice Replacement";
            const message = "A fake message";
            const fakeGlob = "*"

            const fileContentAndPathTupe: FilePathAndContentTuple = [[filePath], [fileContent]]
            const fakeGetContentFromFiles = (glob: Glob) => {
                expect(fakeGlob).toBe(glob)
                return Promise.resolve(fileContentAndPathTupe);
            }

            const fakeGetGrammarAndOrthographReport = (content: FileContent) => Promise.resolve([
                {
                    message,
                    replacements: [{ value: replacementValue }],
                    sentence: content,
                },
            ])

            const result = await generateProofReadingReport(fakeGetContentFromFiles, fakeGetGrammarAndOrthographReport)(fakeGlob)

            const expectedResult = buildFakeProofReadingReport([{
                filePath, sentence: fileContent, replacementValue, message,
            }]);

            expect(expectedResult).toEqual(result)
        });

        it('should return a proofreading report without content if no content has been found', async () => {
            const filePath = "foo.md";
            const fakeGlob = "*.md"

            const fileContentAndPathTupe: FilePathAndContentTuple = [[filePath], []]
            const fakeGetContentFromFiles = (glob: Glob) => {
                expect(fakeGlob).toBe(glob)
                return Promise.resolve(fileContentAndPathTupe);
            }

            const fakeGetGrammarAndOrthographReport = (content: FileContent) => Promise.resolve([])

            const result = await generateProofReadingReport(fakeGetContentFromFiles, fakeGetGrammarAndOrthographReport)(fakeGlob)
            const expectedResult: ProofReadingReport = { [filePath]: [] }

            expect(expectedResult).toEqual(result)
        });
    });

    describe('buildProofReadingReport', () => {
        it('should return an object with report and file name linked', () => {
            const filePath1 = 'src/foo.md';
            const filePath2 = 'src/bar.md';
            const filePaths = [filePath1, filePath2];

            const report = buildFakeRawRawGrammarAndOrthographReport({
                message: 'fakeMessage',
                sentence: 'fakeSentece',
                replacementValue: 'fakereplacementValue',
            });

            const report1 = buildFakeRawRawGrammarAndOrthographReport({
                message: 'fakeMessage1',
                sentence: 'fakeSentece1',
                replacementValue: 'fakereplacementValue1',
            });

            const contents = [report, report1];

            const expectedResult = {
                [filePath1]: report,
                [filePath2]: report1,
            };
            const result = buildProofReadingReport(contents, filePaths);
            expect(result).toEqual(expectedResult);
        });

        it('should return an object with file name but no content if no content provided', () => {
            const report = buildFakeRawRawGrammarAndOrthographReport({
                message: 'fakeMessage1',
                sentence: 'fakeSentece1',
                replacementValue: 'fakereplacementValue1',
            });
            const filePath1 = 'src/foo.md';
            const filePath2 = 'src/bar.md';

            const expectedResult: ProofReadingReport = {
                [filePath1]: report,
                [filePath2]: [],
            };
            const result = buildProofReadingReport([report], [filePath1, filePath2]);
            expect(result).toEqual(expectedResult);
        });
    });
});
