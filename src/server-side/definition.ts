import { RawGrammarAndOrthographReportItem, FileContent } from "../domain"

type Replacement = {
    value: string
}

type Match = {
    message: string,
    shortMessage: string,
    replacements: Array<Replacement>,
    offset: number,
    length: number,
    context: {
        text: string
        offset: number
        length: number
    },
    sentence: string
    type: {
        typeName: string
    },
    rule: {
        id: string
        description:
        string
        issueType: string
        category: {
            id: string
            name: string
        },
    },
}

export type GrammarBotReport = {
    software: {
        name: string,
        version: string,
        apiVersion: number
        premium: boolean,
        premiumHint: string,
        status: string,
    },
    warnings: {
        incompleteResults: boolean,
    },
    language: {
        name: string,
        code: string
        detectedLanguage: {
            name: string
            code: string
        },
    },
    matches: Array<Match>
};
export type RelevantInfosExtractor = (rawReport: GrammarBotReport) => Array<RawGrammarAndOrthographReportItem>

export type RawReportFetcher = (fileConntent: FileContent) => Promise<GrammarBotReport>
