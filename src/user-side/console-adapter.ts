import chalk from "chalk"
import R from "ramda"
import { EOL } from "os"
import { DisplayReport } from "./definition"
import {
    ProofReadingReport, FilePath, ReplacementValue, RawGrammarAndOrthographReportItem,
} from "../domain";

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
    const baseReport = `${formatMessage(reportItem.message)}${EOL}${EOL}${formatSentence(
        reportItem.sentence,
    )}`;

    if (reportItem.replacements.length === 0) return baseReport;

    return `${baseReport}${EOL}${EOL}${chalk.underline(
        'Possible replacements:',
    )} ${formatReplacements(reportItem.replacements)}`;
};

export const makeReportItemtDisplayable = (reportItems: Array<RawGrammarAndOrthographReportItem>) => reportItems.reduce((prev, current) => {
    if (!prev) {
        return formatReport(current);
    }
    return `${prev}${EOL}${EOL}${formatReport(current)}`;
}, '');

const formatSuccessMessage = (successMessage: string) => chalk.green(`${String.fromCharCode(10004)} ${successMessage}`);

export const makeProofReadingReportDisplayable = (proofReadingReport: ProofReadingReport): string => {
    const keys: Array<FilePath> = Object.keys(proofReadingReport);

    return keys.reduce((prev, filePath) => {
        const workingReport = makeReportItemtDisplayable(proofReadingReport[filePath]);
        const finalReport = workingReport || formatSuccessMessage('No mistake found here');

        const formattedFilePath = formatFilePath(filePath);

        if (!prev) {
            return `${formattedFilePath}${EOL}${EOL}${finalReport}`;
        }
        return `${prev}${EOL}${EOL}${formattedFilePath}${EOL}${EOL}${finalReport}`;
    }, '');
};

const displayGenericMessage = (message: string) => {
    log(chalk.bold(message));
};

export const displayReport: DisplayReport = (proofReadingReport: ProofReadingReport) => {
    if (R.isEmpty(proofReadingReport)) {
        displayGenericMessage("There is nothing to check here ...")
        return;
    }
    const displayableProofreadingReport = makeProofReadingReportDisplayable(proofReadingReport);
    displayGenericMessage(`Here is your report :`)
    log(displayableProofreadingReport)
}
