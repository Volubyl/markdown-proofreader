import { Readable } from "stream"
import highland from "highland"
import {
    getContentFromMatchingGlobFiles, isMarkdownGlob, sanatizeGlob, isGitInsert, getAndCleanDiffContentStream,
} from "../../server-side/draft-content-adapter"
import { Glob, FilePath } from "../../domain";

describe('draft-content-adapter', () => {
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
    describe('selectOnlyInserts', () => {
        it('should return false if the string is not a git insert', () => {
            const rawString = "I'm only a raw string";
            expect(isGitInsert(rawString)).toBe(false);
        });

        it('should return false if the string is not a git insert -- funky string case', () => {
            const rawString = "@@ -+##I'm only a raw string";
            expect(isGitInsert(rawString)).toBe(false);
        });

        it('should return false if the string is not a git insert -- ++ case', () => {
            const rawString = "++I'm a git insert";
            expect(isGitInsert(rawString)).toBe(false);
        });

        it('should return true if the string is a git insert', () => {
            const rawString = "+I'm a git insert";
            expect(isGitInsert(rawString)).toBe(true);
        });
        it('should return true if the string is a git insert with space', () => {
            const rawString = "+ I'm a git insert";
            expect(isGitInsert(rawString)).toBe(true);
        });

        it('should return true if the string is a git insert with multiple white space', () => {
            const rawString = "+     I'm a git insert";
            expect(isGitInsert(rawString)).toBe(true);
        });
        it('should return true if the string is a git insert with markdown', () => {
            const rawString = "+## I'm a  markdown string";
            expect(isGitInsert(rawString)).toBe(true);
        });
    });

    describe('getAndCleanDiffContentStream', () => {
        it('should return the inserted lines only ', async () => {
            const insertWithMarkdown = "I'm an insert with markdown";
            const insertWithoutMarkdown = "I'm an insert without markdown";
            const insertWithSpaces = "I'm an insert with a space";

            const deletionWithoutMarkdown = "-I'm not an insert";

            const gitDiff = [
                `+ ### ${insertWithMarkdown}`,
                `+${insertWithoutMarkdown}`,
                `-${deletionWithoutMarkdown}`,
                ` + ${insertWithSpaces}`,
            ].join('\n');

            const readableStream = Readable.from(gitDiff);

            const result = await getAndCleanDiffContentStream(readableStream)
                .collect()
                .toPromise(Promise);

            expect(result).toEqual([
                insertWithMarkdown,
                insertWithoutMarkdown,
                insertWithSpaces,
            ]);
        });

        it('should return an highland stream ', () => {
            const readableStream = Readable.from('foo');
            const stream = getAndCleanDiffContentStream(readableStream);
            expect(highland.isStream(stream)).toBeTruthy();
        });

        it('should throw an error if an invalid stream provided as input ', () => {
            const invalidStream = 'not a stream';
            // @ts-ignore -- just for testing purpose.
            //  we explecitly want to give something that is not a stream
            expect(() => getAndCleanDiffContentStream(invalidStream)).toThrow(Error);
        });
    });
});
