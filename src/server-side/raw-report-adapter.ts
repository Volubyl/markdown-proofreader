import Grammarbot from "grammarbot"
import {
    pipe, isEmpty, map, filter, partial,
} from "ramda"
import {
    GetRawGrammarAndOrthographReport, FileContent, RawGrammarAndOrthographReportItem, Replacement, ReplacementValue,
} from "../domain";
import { RawReportFetcher, RelevantInfosExtractor } from "./definition";

const getGrammarBotReport: RawReportFetcher = async (rawContent) => {
    const bot = new Grammarbot();
    return bot.checkAsync(rawContent);
};

const mapReplacementToReplacementValue = (replacement: Replacement): ReplacementValue => replacement.value
const removeWhiteSpacedReplacementValue = (replacementValue: ReplacementValue) => replacementValue.trim()

const mapAndCleanReplacement = (replacements: Replacement): ReplacementValue => pipe(mapReplacementToReplacementValue, removeWhiteSpacedReplacementValue)(replacements)

const isEmptyReplacementValue = (replacementValue: ReplacementValue) => !isEmpty(replacementValue)

export const buildReplacementValues = (replacements: Array<Replacement>) => pipe(map(mapAndCleanReplacement), filter(isEmptyReplacementValue))(replacements)

export const extractRelevantInfosFromGrammarBotReport: RelevantInfosExtractor = (grammarBotReport): Array<RawGrammarAndOrthographReportItem> => {
    const { matches } = grammarBotReport;
    return matches.map(({ message, replacements, sentence }) => ({
        message,
        replacements: buildReplacementValues(replacements),
        sentence,
    }));
};

export const buildRawReport = async (fetchRawReport: RawReportFetcher, extractRelevantInfos: RelevantInfosExtractor, fileConntent: FileContent): Promise<Array<RawGrammarAndOrthographReportItem>> => {
    const rawReport = await fetchRawReport(fileConntent);
    return extractRelevantInfos(rawReport)
}

export const getReportFromGrammarBot: GetRawGrammarAndOrthographReport = partial(buildRawReport, [getGrammarBotReport, extractRelevantInfosFromGrammarBotReport])
