#!/usr/bin/env node

import { program } from 'commander';
import chalk from "chalk"
import { generateProofReadingReport, Glob, ProofReadingReport } from "./domain";
import { getContentFromMarkdownFiles, getReportFromGrammarBot, getContentFromGitDiffs } from "./server-side"
import { displayReport } from "./user-side";

const { log, error } = console

const displayErrorMessage = (e: Error) => {
    log(chalk.red.bold(`Oh snap something went wrong :`));
    error(e);
};

const generateAndDisplayReport = async (diffOnly: boolean, glob: Glob) => {
    try {
        let proofReadingReport: ProofReadingReport;
        if (diffOnly) {
            proofReadingReport = await generateProofReadingReport(getContentFromGitDiffs, getReportFromGrammarBot);
            displayReport(proofReadingReport);
        } else {
            proofReadingReport = await generateProofReadingReport(getContentFromMarkdownFiles, getReportFromGrammarBot, glob);
        }
        displayReport(proofReadingReport)
    } catch (e) {
        displayErrorMessage(e)
    }
};

program
    .name('markdownproofreader')
    .version('0.O.1')
    .option(
        '--diff-only',
        'will only check the diff from the previous commit. Default to false',
        false,
    )
    .option(
        '--match <glob>',
        'only check files that match the glob. Default value : *.md',
        '*.md',
    );

program.parse(process.argv);

const { diffOnly, match: glob } = program;

generateAndDisplayReport(glob, diffOnly);
