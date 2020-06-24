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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var spawn = require('child_process').spawn;
var isNodeStream = require('is-stream');
var highland = require('highland');
var remark = require('remark');
var strip = require('strip-markdown');
var fs = require('fs');
var fg = require('fast-glob');
var Grammarbot = require('grammarbot');
// We are only intersted by strings beginning by '+' and not by those beginning by '++'
var isGitInsert = function (input) { return /^\+[^+]/.test(input); };
// Git prepend the inserted lines with a '+' sign
var removeGitInsertSign = function (input) { return input.replace('+', ''); };
// Proofreading APIs have a quota limited in number of characters.
// We only want to check the content not the markdown layout
var stripMarkdown = function (markdownText) {
    var data;
    remark()
        .use(strip)
        .process(markdownText, function (err, cleanData) {
        if (err)
            throw err;
        data = cleanData;
    });
    return String(data);
};
var trim = function (x) { return x.trim(); };
var removeNewLign = function (x) { return x.replace('\n', ''); };
var getCleanContentPipleLine = function () { return highland.pipeline(highland.map(stripMarkdown), highland.map(removeNewLign)); };
var getDiffContentStream = function (gitDiffStream) {
    if (!isNodeStream(gitDiffStream))
        throw new Error('Invalid stream provided');
    var cleanDiffContent = highland.pipeline(highland.split(), highland.map(trim), highland.filter(isGitInsert), highland.map(removeGitInsertSign), highland.map(trim));
    return highland(gitDiffStream).pipe(cleanDiffContent);
};
var getContentForNewAndModifiedFiles = function () {
    var gitDiffStream = spawn('git', ['diff', '--cached', '*.md']).stdout;
    return getDiffContentStream(gitDiffStream)
        .pipe(getCleanContentPipleLine())
        .collect()
        .toPromise(Promise);
};
var isMarkdownGlob = function (glob) { return ['{md}', 'md'].includes(glob.split('.').pop()); };
// it's just a little layer of security to avoid reading non-markdown files.
// Real security is done by cleaning up the markdown afterwards
var sanatizeGlob = function (glob) {
    if (isMarkdownGlob(glob)) {
        return glob;
    }
    return glob + ".md";
};
var getMarkdownFilePaths = function (glob) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, fg(sanatizeGlob(glob), {
                ignore: 'node_modules',
            })];
    });
}); };
var getContentFromFiles = function (filesPaths) {
    var readFile = highland.wrapCallback(fs.readFile);
    return highland(filesPaths)
        .map(readFile)
        .stopOnError(function (err) {
        throw new Error(err);
    })
        .series()
        .map(String)
        .pipe(getCleanContentPipleLine())
        .collect()
        .toPromise(Promise);
};
var getContentFromMarkdownFiles = function (glob) { return __awaiter(_this, void 0, void 0, function () {
    var filesPaths, contents;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getMarkdownFilePaths(glob)];
            case 1:
                filesPaths = _a.sent();
                return [4 /*yield*/, getContentFromFiles(filesPaths)];
            case 2:
                contents = _a.sent();
                console.log("contents", contents);
                console.log("filesPaths", filesPaths);
                return [2 /*return*/, [filesPaths, contents]];
        }
    });
}); };
var linkReporttAndFilePath = function (contents, filesPaths) {
    var reducer = function (previous, current, index) {
        var _a;
        return (__assign(__assign({}, previous), (_a = {}, _a[current] = contents[index] || [], _a)));
    };
    return filesPaths.reduce(reducer, {});
};
var extractRelevantInfosFromGrammarBotReport = function (grammarBotReport) {
    var matches = grammarBotReport.matches;
    return matches.map(function (_a) {
        var message = _a.message, replacements = _a.replacements, sentence = _a.sentence;
        return ({
            message: message,
            replacements: replacements,
            sentence: sentence,
        });
    });
};
var getGrammarBotReport = function (rawContent) { return __awaiter(_this, void 0, void 0, function () {
    var bot;
    return __generator(this, function (_a) {
        bot = new Grammarbot();
        return [2 /*return*/, bot.checkAsync(rawContent)];
    });
}); };
var generateReportFromDiffs = function () { return __awaiter(_this, void 0, void 0, function () {
    var insertedText, grammarBotReport, shortenendReport;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getContentForNewAndModifiedFiles()];
            case 1:
                insertedText = _a.sent();
                if (insertedText.length === 0) {
                    return [2 /*return*/, linkReporttAndFilePath([], 
                        // currently the diffs are coming from various files.
                        // This will be displayed in the terminal :
                        ['From various source file'])];
                }
                return [4 /*yield*/, getGrammarBotReport(insertedText.join('\n'))];
            case 2:
                grammarBotReport = _a.sent();
                shortenendReport = extractRelevantInfosFromGrammarBotReport(grammarBotReport);
                return [2 /*return*/, linkReporttAndFilePath([shortenendReport], 
                    // currently the diffs are coming from various files.
                    // This will be displayed in the terminal :
                    ['From various source file'])];
        }
    });
}); };
// this function only exists to allow dependency injection mostly for testing purpose
// it's a nice alternative to mocking because
// - Would be cool to avoid XHR call while testing
// - Would be also nice to make dependencies with side effects more predicatble
var partialGenerateReportForMatchingFiles = function (sendContentToProofreadingAPI, getFileContentMatchingGlob) { return function (glob) { return __awaiter(_this, void 0, void 0, function () {
    var _a, filePaths, fileContents, plannedGrammarBotCall, grammarBotReports, shortenedReports;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (typeof sendContentToProofreadingAPI !== 'function') {
                    throw new Error('"sendContentToProofreadingAPI" is not a valid function');
                }
                if (typeof getFileContentMatchingGlob !== 'function') {
                    throw new Error('"getFileContentMatchingGlob" is not a valid function');
                }
                return [4 /*yield*/, getFileContentMatchingGlob(glob)];
            case 1:
                _a = _b.sent(), filePaths = _a[0], fileContents = _a[1];
                if (fileContents.length === 0)
                    return [2 /*return*/, linkReporttAndFilePath([], filePaths)];
                plannedGrammarBotCall = fileContents.map(function (content) { return sendContentToProofreadingAPI(content); });
                return [4 /*yield*/, Promise.all(plannedGrammarBotCall)];
            case 2:
                grammarBotReports = _b.sent();
                shortenedReports = grammarBotReports.map(extractRelevantInfosFromGrammarBotReport);
                return [2 /*return*/, linkReporttAndFilePath(shortenedReports, filePaths)];
        }
    });
}); }; };
module.exports = {
    getContentForNewAndModifiedFiles: getContentForNewAndModifiedFiles,
    getMarkdownFilePaths: getMarkdownFilePaths,
    isGitInsert: isGitInsert,
    isMarkdownGlob: isMarkdownGlob,
    sanatizeGlob: sanatizeGlob,
    generateReportFromDiffs: generateReportFromDiffs,
    partialGenerateReportForMatchingFiles: partialGenerateReportForMatchingFiles,
    generateReportForMatchingMarkdownFiles: partialGenerateReportForMatchingFiles(getGrammarBotReport, getContentFromMarkdownFiles),
    extractRelevantInfosFromGrammarBotReport: extractRelevantInfosFromGrammarBotReport,
    linkReporttAndFilePath: linkReporttAndFilePath,
    getCleanContentPipleLine: getCleanContentPipleLine,
    getContentFromFiles: getContentFromFiles,
    getDiffContentStream: getDiffContentStream,
};
