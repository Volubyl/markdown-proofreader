export type FileContent = string
export type FilePath = string
export type FilePathAndContentTuple = [Array<FilePath>, Array<FileContent>];
export type Replacement = {
    value: string
}

export type Glob = string;

export type RawGrammarAndOrthographReportItem = {
    message: string,
    replacements: Array<Replacement>,
    sentence: string
}

export type ProofReadingReport = {
    [filePath: string]: Array<RawGrammarAndOrthographReportItem>
}

export type GetContentFromFiles = (glob: Glob) => Promise<FilePathAndContentTuple>;

export type GetRawGrammarAndOrthographReport =
    (fileContent: FileContent) => Promise<Array<RawGrammarAndOrthographReportItem>>;

export type GenerateProofReadingReport = (getContentFromFiles: GetContentFromFiles, getRawGrammarAndOrthographReport: GetRawGrammarAndOrthographReport) =>
    (glob: Glob) => Promise<ProofReadingReport>
