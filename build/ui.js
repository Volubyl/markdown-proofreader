var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var chalk = require('chalk');
var log = console.log, error = console.error;
var filterReplacement = function (replacements) { return replacements
    .map(function (item) { return item.value; })
    .map(function (item) { return item.trim(); })
    .filter(function (item) { return item; }); };
var formatReplacements = function (replacements) {
    if (replacements.length > 0)
        return replacements.join(', ');
    return replacements[0];
};
var formatMessage = function (message) { return chalk.red(String.fromCharCode(10007)) + " " + chalk.bold(message); };
var formatSentence = function (sentence) { return chalk.bold(String.fromCharCode(8227)) + " " + chalk.bold('Sentence:') + " " + sentence; };
var formatFilePath = function (filepath) { return chalk.bold.magentaBright(String.fromCharCode(8608) + " File: " + filepath); };
var formatReport = function (report) {
    var baseReport = formatMessage(report.message) + "\n\n" + formatSentence(report.sentence);
    var filtredReplacement = filterReplacement(report.replacements);
    if (filtredReplacement.length === 0)
        return baseReport;
    return baseReport + "\n\n" + chalk.underline('Possible replacements:') + " " + formatReplacements(filtredReplacement);
};
var formatSuccessMessage = function (successMessage) { return chalk.green(String.fromCharCode(10004) + " " + successMessage); };
var makeOneReportDisplayable = function (report) { return report.reduce(function (prev, current) {
    if (!prev) {
        return formatReport(current);
    }
    return prev + "\n\n" + formatReport(current);
}, ''); };
var makeMultipleReportDislayable = function (reports) {
    var keys = Object.keys(reports);
    return keys.reduce(function (prev, filePath) {
        var workingReport = makeOneReportDisplayable(reports[filePath]);
        var finalReport = workingReport || formatSuccessMessage('No mistake found here');
        var formattedFilePath = formatFilePath(filePath);
        if (!prev) {
            return formattedFilePath + "\n\n" + finalReport;
        }
        return prev + "\n\n" + formattedFilePath + "\n\n" + finalReport;
    }, '');
};
var displayReports = function (reports) {
    var workingReports = __assign({}, reports);
    var title = "We've checked your files. Here is what we found :";
    log(chalk.bold(title) + "\n\n" + makeMultipleReportDislayable(workingReports));
};
var displaySuccessMessage = function () { return log(formatSuccessMessage('Allright! No mistake found, My Capitain')); };
var displayErrorMessage = function (e) {
    log(chalk.red.bold("Oh snap something went wrong :"));
    error(e);
};
var displayInfoMessage = function (message) { return log(chalk.bold("\n" + message + "\n")); };
module.exports = {
    formatReplacements: formatReplacements,
    displayReports: displayReports,
    formatMessage: formatMessage,
    formatSentence: formatSentence,
    makeMultipleReportDislayable: makeMultipleReportDislayable,
    makeOneReportDisplayable: makeOneReportDisplayable,
    filterReplacement: filterReplacement,
    displayErrorMessage: displayErrorMessage,
    displayInfoMessage: displayInfoMessage,
    displaySuccessMessage: displaySuccessMessage,
};
