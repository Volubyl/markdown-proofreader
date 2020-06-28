import chalk from "chalk"
import { DisplayReport } from "./definition"
import {
    ProofReadingReport, FilePath, ReplacementValue, RawGrammarAndOrthographReportItem,
} from "../domain"

const { log } = console;

export const formatReplacements = (replacements: Array<ReplacementValue>) => {
    if (replacements.length > 0) return replacements.join(', ');
    return replacements[0];
};

export const formatMessage = (message: string) => `${chalk.red(String.fromCharCode(10007))} ${chalk.bold(message)}`;

export const formatSentence = (sentence: string) => `${chalk.bold(String.fromCharCode(8227))} ${chalk.bold(
    'Sentence:',
)} ${sentence}`;

const formatFilePath = (filepath: FilePath) => chalk.bold.magentaBright(`${String.fromCharCode(8608)} File: ${filepath}`);

const formatReport = (reportItem: RawGrammarAndOrthographReportItem) => {
    const baseReport = `${formatMessage(reportItem.message)}\n\n${formatSentence(
        reportItem.sentence,
    )}`;

    if (reportItem.replacements.length === 0) return baseReport;

    return `${baseReport}\n\n${chalk.underline(
        'Possible replacements:',
    )} ${formatReplacements(reportItem.replacements)}`;
};

export const makeOneReportDisplayable = (reportItems: Array<RawGrammarAndOrthographReportItem>) => reportItems.reduce((prev, current) => {
    if (!prev) {
        return formatReport(current);
    }
    return `${prev}\n\n${formatReport(current)}`;
}, '');

export const makeProofReadingReportDisplayable = (proofReadingReport: ProofReadingReport): string => {
    const keys: Array<FilePath> = Object.keys(proofReadingReport);

    return keys.reduce((prev, filePath) => {
        const workingReport = makeOneReportDisplayable(proofReadingReport[filePath]);
        const finalReport = workingReport || formatSuccessMessage('No mistake found here');

        const formattedFilePath = formatFilePath(filePath);

        if (!prev) {
            return `${formattedFilePath}\n\n${finalReport}`;
        }
        return `${prev}\n\n${formattedFilePath}\n\n${finalReport}`;
    }, '');
};

export const displayReport: DisplayReport = (proofReadingReport: ProofReadingReport) => {
    const displayableProofreadingReport = makeProofReadingReportDisplayable(proofReadingReport);
    log(displayableProofreadingReport)
}
