import highland from 'highland';
import remark from 'remark';
import strip from 'strip-markdown';
import fs from 'fs';
import fg from 'fast-glob';
import R from "ramda";
import { spawn } from "child_process"
import isNodeStream from "is-stream"

import { Readable } from 'stream';
import {
    GetDraftContent, Glob, FilePath, FilePathAndContentTuple,
} from '../domain';

const trim = (x: string) => x.trim();
// We are only intersted by strings beginning by '+' and not by those beginning by '++'
export const isGitInsert = (input: string) => /^\+[^+]/.test(input);

// Git prepend the inserted lines with a '+' sign
const removeGitInsertSign = (input: string) => input.replace('+', '');

// Proofreading APIs have a quota limited in number of characters.
// We only want to check the content not the markdown layout
const stripMarkdown = (markdownText: string) => {
    let data;
    remark()
        .use(strip)
        .process(markdownText, (err: Error, cleanData: any) => {
            if (err) throw err;
            data = cleanData;
        });

    return String(data);
};
export const isMarkdownGlob = (glob: Glob) => ['{md}', 'md'].includes(glob.split('.').pop());

const removeNewLign = (x: string) => x.replace('\n', '');

export const getAndCleanDiffContentStream = (gitDiffStream: Readable): Highland.Stream<string> => {
    if (!isNodeStream(gitDiffStream)) throw new Error('Invalid stream provided');
    return highland<string>(gitDiffStream)
        .split()
        .map(trim)
        .filter(isGitInsert)
        .map(removeGitInsertSign)
        .map(trim)
        .map(stripMarkdown)
        .map(removeNewLign)
};

type FileContentExtractor = (filepaths?: Array<FilePath>) => Promise<Array<string>>

const getContentForNewAndModifiedFiles: FileContentExtractor = () => {
    const gitDiffStream = spawn('git', ['diff', '--cached', "*.md"]).stdout;
    return getAndCleanDiffContentStream(gitDiffStream)
        .collect()
        .toPromise(Promise);
};

const extractAndCleanContentFromFiles: FileContentExtractor = (filesPaths) => {
    if (filesPaths.length === 0 || !filesPaths) {
        throw new Error("You must provide an array of FilePath")
    }

    const readFile = highland.wrapCallback(fs.readFile);
    return highland(filesPaths)
        .map(readFile)
        .stopOnError((err: Error) => {
            throw err
        })
        .series()
        .map(String)
        .map(stripMarkdown)
        .map(removeNewLign)
        .collect()
        .toPromise(Promise);
}

// it's just a little layer of security to avoid reading non-markdown files.
// Real security is done by cleaning up the markdown afterwards
export const sanatizeGlob = (glob: Glob) => {
    if (isMarkdownGlob(glob)) {
        return glob;
    }

    return `${glob}.md`;
};

type FilePathFetcher = (glob: Glob) => Promise<Array<FilePath>>

const getMarkdownFilePathsMatchingGlob: FilePathFetcher = async (glob) => fg(sanatizeGlob(glob), {
    ignore: ['node_modules'],
});

export const getContentFromMatchingGlobFiles = async (getFilePaths: FilePathFetcher, extractContentFromFiles: FileContentExtractor, glob: Glob): Promise<FilePathAndContentTuple> => {
    const filesPaths = await getFilePaths(glob);
    const contents = await extractContentFromFiles(filesPaths);
    return [filesPaths, contents];
}
export const partialGetContentFromGitDiffs = async (extractContentFromFiles: FileContentExtractor): Promise<FilePathAndContentTuple> => {
    const contents = await extractContentFromFiles();
    return [["From various files :"], contents];
}

export const getContentFromMarkdownFiles: GetDraftContent = R.partial(getContentFromMatchingGlobFiles, [getMarkdownFilePathsMatchingGlob, extractAndCleanContentFromFiles]);
export const getContentFromGitDiffs: GetDraftContent = R.partial(partialGetContentFromGitDiffs, [getContentForNewAndModifiedFiles]);
