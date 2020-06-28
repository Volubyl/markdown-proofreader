import Grammarbot from "grammarbot"
import R from "ramda"
import {
    GetRawGrammarAndOrthographReport, FileContent, RawGrammarAndOrthographReportItem, Replacement,
} from "../domain";
import { RawReportFetcher, RelevantInfosExtractor } from "./definition";

const getGrammarBotReport: RawReportFetcher = async (rawContent) => {
    const bot = new Grammarbot();
    return bot.checkAsync(rawContent);
};

const mapReplacementToReplacementValue = (replacements: Array<Replacement>) => replacements.map((item) => item.value)
const removeInexistantReplacement = (replacements: Array<Replacement>) => replacements.filter((item) => item);

const buildReplacementValues = (replacements: Array<Replacement>) => R.pipe(removeInexistantReplacement, mapReplacementToReplacementValue)(replacements)

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

export const getReportFromGrammarBot: GetRawGrammarAndOrthographReport = R.partial(buildRawReport, [getGrammarBotReport, extractRelevantInfosFromGrammarBotReport])
