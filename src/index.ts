#!/usr/bin/env node

import { program } from 'commander';
import { generateProofReadingReport, Glob } from "./domain";
import { getContentFromMarkdownFiles, getReportFromGrammarBot } from "./server-side"
import { displayReport } from "./user-side"

const generateAndDisplayReport = async (glob: Glob) => {
    try {
        const proofReadingReport = await generateProofReadingReport(getContentFromMarkdownFiles, getReportFromGrammarBot)(glob);
        displayReport(proofReadingReport)
    } catch (e) {
        displayErrorMessage(e);
    }
};

program
    .name('markdownproofreader')
    .version('0.O.1')
    .option(
        '--match <glob>',
        'only check files that match the glob. Default value : *.md',
        '*.md',
    );

program.parse(process.argv);

const { match } = program;

generateAndDisplayReport(match);
