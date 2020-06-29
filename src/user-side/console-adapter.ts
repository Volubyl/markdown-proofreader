import chalk from "chalk"
import { DisplayReport } from "./definition"
import {
    ProofReadingReport, FilePath, ReplacementValue, RawGrammarAndOrthographReportItem,
} from "../domain"

const { log, error } = console;

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

export const makeReportItemtDisplayable = (reportItems: Array<RawGrammarAndOrthographReportItem>) => reportItems.reduce((prev, current) => {
    if (!prev) {
        return formatReport(current);
    }
    return `${prev}\n\n${formatReport(current)}`;
}, '');

const formatSuccessMessage = (successMessage: string) => chalk.green(`${String.fromCharCode(10004)} ${successMessage}`);

export const makeProofReadingReportDisplayable = (proofReadingReport: ProofReadingReport): string => {
    const keys: Array<FilePath> = Object.keys(proofReadingReport);

    return keys.reduce((prev, filePath) => {
        const workingReport = makeReportItemtDisplayable(proofReadingReport[filePath]);
        const finalReport = workingReport || formatSuccessMessage('No mistake found here');

        const formattedFilePath = formatFilePath(filePath);

        if (!prev) {
            return `${formattedFilePath}\n\n${finalReport}`;
        }
        return `${prev}\n\n${formattedFilePath}\n\n${finalReport}`;
    }, '');
};

const displayErrorMessage = (e: Error) => {
    log(chalk.red.bold(`Oh snap something went wrong :`));
    error(e);
};

const displayGenericMessage = (message: string) => {
    log(chalk.bold(message));
};

export const displayReport: DisplayReport = (proofReadingReport: ProofReadingReport) => {
    try {
        if (!Object.prototype.hasOwnProperty.call(proofReadingReport)) {
            displayGenericMessage("There is nothing to check here ...")
            return;
        }
        const displayableProofreadingReport = makeProofReadingReportDisplayable(proofReadingReport);
        displayGenericMessage(`Here is your report :`)
        log(displayableProofreadingReport)
    } catch (e) {
        displayErrorMessage(e)
    }
}
