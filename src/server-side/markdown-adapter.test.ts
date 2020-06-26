import { Readable } from "stream"
import highland from "highland"
import {
    getContentFromMatchingGlobFiles, isMarkdownGlob, sanatizeGlob, getCleanContentPipleLine,
} from "./markdown-adapter"
import { Glob, FilePath } from "../domain";

describe('MarkdownAdapter', () => {
    describe('getContentFromMatchingGlobFiles', () => {
        it('should return a valid tuple with the file paths and file content', async () => {
            const fakeGlob = "*.md";
            const fakeFilePath = ["tutu.md", "tourte.md"];

            const fakeContent = ["Hello"];
            const fakeFilePathFetcher = (glob: Glob) => {
                expect(glob).toBe(fakeGlob)
                return Promise.resolve(fakeFilePath)
            };

            const fakeFileContentExtratcor = (filePaths: Array<FilePath>) => {
                expect(filePaths).toEqual(fakeFilePath)
                return Promise.resolve(fakeContent)
            }

            const expectedResult = [fakeFilePath, fakeContent]
            const result = await getContentFromMatchingGlobFiles(fakeFilePathFetcher, fakeFileContentExtratcor, fakeGlob);
            expect(result).toEqual(expectedResult)
        });
    });

    describe('isMarkdownGlob', () => {
        it('should return false if the glob has a non md file extension', () => {
            const glob = 'src/**/*.js';
            const result = isMarkdownGlob(glob);

            expect(result).toBeFalsy();
        });

        it('should return false if the glob has no file extension', () => {
            const glob = 'src/**/*';
            const result = isMarkdownGlob(glob);

            expect(result).toBeFalsy();
        });

        it('should return true if the glob has md extension', () => {
            const glob = 'src/**/*.md';
            const result = isMarkdownGlob(glob);

            expect(result).toBeTruthy();
        });

        it('should return true if the glob has {md} extension', () => {
            const glob = 'src/**/*.{md}';
            const result = isMarkdownGlob(glob);

            expect(result).toBeTruthy();
        });
    });

    describe('sanatizeGlob', () => {
        it('should append {.md} to a non md glob', () => {
            const glob = 'src/**/*.js';
            const result = sanatizeGlob(glob);

            expect(result).toBe('src/**/*.js.md');
        });

        it('should append .md to a glob without specified extension', () => {
            const glob = 'src/**/*';
            const result = sanatizeGlob(glob);

            expect(result).toBe('src/**/*.md');
        });

        it('should do nothing if markdown glob provided', () => {
            const glob = 'src/**/*.md';
            const result = sanatizeGlob(glob);

            expect(result).toBe(glob);
        });

        it('should do nothing if markdown glob provided', () => {
            const glob = 'src/**/*.{md}';
            const result = sanatizeGlob(glob);

            expect(result).toBe(glob);
        });
    });

    describe('getCleanContentPipleLine', () => {
        it('should remove markdown sign and new line mark', async () => {
            // Here the goal is not to test if we remove all the markdown
            // The library is already tested
            const title = "I'm a markdownText";
            const paragraph = "I'm the secondParagraph";
            const markownContent = [`### ${title}\n`, `${paragraph}`];

            const readableStream = Readable.from(markownContent);
            const result = await highland(readableStream)
                .pipe(getCleanContentPipleLine())
                .collect()
                .toPromise(Promise);

            expect(result).toEqual([title, paragraph]);
        });
    });
});
