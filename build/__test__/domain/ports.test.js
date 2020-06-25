"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var domain_1 = require("../../src/domain");
var report_1 = require("../fixtures/report");
describe('Domain -- Ports', function () {
    describe('generateProofReadingReport', function () {
        it('should return a complete proofreading report', function () { return __awaiter(void 0, void 0, void 0, function () {
            var filePath, fileContent, replacementValue, message, fakeGlob, fileContentAndPathTupe, fakeGetContentFromFiles, fakeGetGrammarAndOrthographReport, result, expectedResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filePath = "foo.md";
                        fileContent = "I'm some content";
                        replacementValue = "A nice Replacement";
                        message = "A fake message";
                        fakeGlob = "*";
                        fileContentAndPathTupe = [[filePath], [fileContent]];
                        fakeGetContentFromFiles = function (glob) {
                            expect(fakeGlob).toBe(glob);
                            return Promise.resolve(fileContentAndPathTupe);
                        };
                        fakeGetGrammarAndOrthographReport = function (content) { return Promise.resolve([
                            {
                                message: message,
                                replacements: [{ value: replacementValue }],
                                sentence: content,
                            },
                        ]); };
                        return [4 /*yield*/, domain_1.generateProofReadingReport(fakeGetContentFromFiles, fakeGetGrammarAndOrthographReport)(fakeGlob)];
                    case 1:
                        result = _a.sent();
                        expectedResult = report_1.buildFakeProofReadingReport([{
                                filePath: filePath,
                                sentence: fileContent,
                                replacementValue: replacementValue, message: message,
                            }]);
                        expect(expectedResult).toEqual(result);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return a proofreading report without content if no content has been found', function () { return __awaiter(void 0, void 0, void 0, function () {
            var filePath, fakeGlob, fileContentAndPathTupe, fakeGetContentFromFiles, fakeGetGrammarAndOrthographReport, result, expectedResult;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        filePath = "foo.md";
                        fakeGlob = "*.md";
                        fileContentAndPathTupe = [[filePath], []];
                        fakeGetContentFromFiles = function (glob) {
                            expect(fakeGlob).toBe(glob);
                            return Promise.resolve(fileContentAndPathTupe);
                        };
                        fakeGetGrammarAndOrthographReport = function (content) { return Promise.resolve([]); };
                        return [4 /*yield*/, domain_1.generateProofReadingReport(fakeGetContentFromFiles, fakeGetGrammarAndOrthographReport)(fakeGlob)];
                    case 1:
                        result = _b.sent();
                        expectedResult = (_a = {}, _a[filePath] = [], _a);
                        expect(expectedResult).toEqual(result);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('buildProofReadingReport', function () {
        it('should return an object with report and file name linked', function () {
            var _a;
            var filePath1 = 'src/foo.md';
            var filePath2 = 'src/bar.md';
            var filePaths = [filePath1, filePath2];
            var report = report_1.buildFakeRawRawGrammarAndOrthographReport({
                message: 'fakeMessage',
                sentence: 'fakeSentece',
                replacementValue: 'fakereplacementValue',
            });
            var report1 = report_1.buildFakeRawRawGrammarAndOrthographReport({
                message: 'fakeMessage1',
                sentence: 'fakeSentece1',
                replacementValue: 'fakereplacementValue1',
            });
            var contents = [report, report1];
            var expectedResult = (_a = {},
                _a[filePath1] = report,
                _a[filePath2] = report1,
                _a);
            var result = domain_1.buildProofReadingReport(contents, filePaths);
            expect(result).toEqual(expectedResult);
        });
        it('should return an object with file name but no content if no content provided', function () {
            var _a;
            var report = report_1.buildFakeRawRawGrammarAndOrthographReport({
                message: 'fakeMessage1',
                sentence: 'fakeSentece1',
                replacementValue: 'fakereplacementValue1',
            });
            var filePath1 = 'src/foo.md';
            var filePath2 = 'src/bar.md';
            var expectedResult = (_a = {},
                _a[filePath1] = report,
                _a[filePath2] = [],
                _a);
            var result = domain_1.buildProofReadingReport([report], [filePath1, filePath2]);
            expect(result).toEqual(expectedResult);
        });
    });
});
