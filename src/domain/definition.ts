export type FileContent = string
export type FilePath = string
export type FilePathAndContentTuple = [Array<FilePath>, Array<FileContent>];

export type ReplacementValue = string
export type Replacement = {
    value: ReplacementValue
}

export type Glob = string;

export type RawGrammarAndOrthographReportItem = {
    message: string,
    replacements: Array<ReplacementValue>,
    sentence: string
}

export type ProofReadingReport = {
    [filePath: string]: Array<RawGrammarAndOrthographReportItem>
}

export type GetDraftContent = (glob?: Glob) => Promise<FilePathAndContentTuple>;

export type GetRawGrammarAndOrthographReport =
    (fileContent: FileContent) => Promise<Array<RawGrammarAndOrthographReportItem>>;

export type GenerateProofReadingReport = (getDraftContent: GetDraftContent, getRawGrammarAndOrthographReport: GetRawGrammarAndOrthographReport, glob?: Glob) =>
    Promise<ProofReadingReport>
