import Grammarbot from "grammarbot"
import R from "ramda"
import { GetRawGrammarAndOrthographReport, FileContent, RawGrammarAndOrthographReportItem } from "../domain";
import { RawReportFetcher, RelevantInfosExtractor } from "./definition";

const getGrammarBotReport: RawReportFetcher = async (rawContent) => {
    const bot = new Grammarbot();
    return bot.checkAsync(rawContent);
};

export const extractRelevantInfosFromGrammarBotReport: RelevantInfosExtractor = (grammarBotReport): Array<RawGrammarAndOrthographReportItem> => {
    const { matches } = grammarBotReport;
    return matches.map(({ message, replacements, sentence }) => ({
        message,
        replacements,
        sentence,
    }));
};

export const buildRawReport = async (fetchRawReport: RawReportFetcher, extractRelevantInfos: RelevantInfosExtractor, fileConntent: FileContent): Promise<Array<RawGrammarAndOrthographReportItem>> => {
    const rawReport = await fetchRawReport(fileConntent);
    return extractRelevantInfos(rawReport)
}

const getReportFromGrammarBot: GetRawGrammarAndOrthographReport = R.partial(buildRawReport, [getGrammarBotReport, extractRelevantInfosFromGrammarBotReport])

export default getReportFromGrammarBot
