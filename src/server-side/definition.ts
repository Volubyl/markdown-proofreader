type FilePathAndContentTuple = [[string], string];
type Glob = string;

type GrammarAndOrthographReport = {
    message: string,
    replacements: string,
    sentence: string
}

// maybe this type should be provided by the domain as a contract

export type GetContentFromFiles = (glob: Glob) => Promise<FilePathAndContentTuple>;
export type GetGrammarAndOrthographReport = () => Promise<Array<GrammarAndOrthographReport>>;
