import highland from 'highland';
import remark from 'remark';
import strip from 'strip-markdown';
import fs from 'fs';
import fg from 'fast-glob';
import R from "ramda"
import {
    GetContentFromFiles, Glob, FilePath, FilePathAndContentTuple,
} from '../domain';

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

const removeNewLign = (x: string) => x.replace('\n', '');

export const getCleanContentPipleLine = () => highland.pipeline(
    highland.map(stripMarkdown),
    highland.map(removeNewLign),
);

type FileContentExtractor = (filepaths: Array<FilePath>) => Promise<any>

const extractAndCleanContentFromFiles: FileContentExtractor = (filesPaths) => {
    const readFile = highland.wrapCallback(fs.readFile);
    return highland(filesPaths)
        .map(readFile)
        .stopOnError((err: string) => {
            throw new Error(err);
        })
        .series()
        .map(String)
        .pipe(getCleanContentPipleLine())
        .collect()
        .toPromise(Promise);
}

export const isMarkdownGlob = (glob: Glob) => ['{md}', 'md'].includes(glob.split('.').pop());

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

const getContentFromMarkdownFiles: GetContentFromFiles = R.partial(getContentFromMatchingGlobFiles, [getMarkdownFilePathsMatchingGlob, extractAndCleanContentFromFiles])

export default getContentFromMarkdownFiles
