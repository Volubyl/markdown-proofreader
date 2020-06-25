#!/usr/bin/env node
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
var program = require('commander').program;
var _a = require('./ui'), displayErrorMessage = _a.displayErrorMessage, displayReports = _a.displayReports, displayInfoMessage = _a.displayInfoMessage;
var _b = require('./core'), generateReportFromDiffs = _b.generateReportFromDiffs, generateReportForMatchingMarkdownFiles = _b.generateReportForMatchingMarkdownFiles, sanatizeGlob = _b.sanatizeGlob;
var generateAndDisplayReport = function (onlyDiffs, match) { return __awaiter(_this, void 0, void 0, function () {
    var report, sanatizedGlob, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                if (!onlyDiffs) return [3 /*break*/, 2];
                return [4 /*yield*/, generateReportFromDiffs()];
            case 1:
                report = _a.sent();
                return [3 /*break*/, 4];
            case 2:
                sanatizedGlob = sanatizeGlob(match);
                displayInfoMessage("checking file(s) matching: " + sanatizedGlob);
                return [4 /*yield*/, generateReportForMatchingMarkdownFiles(sanatizedGlob)];
            case 3:
                report = _a.sent();
                _a.label = 4;
            case 4:
                displayReports(report);
                process.exit(0);
                return [3 /*break*/, 6];
            case 5:
                e_1 = _a.sent();
                displayErrorMessage(e_1);
                process.exit(1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
program
    .name('markdownproofreader')
    .version('0.O.1')
    .option('--diff-only', 'will only check the diff from the previous commit. Default to false', false)
    .option('--match <glob>', 'only check files that match the glob. Default value : *.md', '*.md');
program.parse(process.argv);
var diffOnly = program.diffOnly, match = program.match;
generateAndDisplayReport(diffOnly, match);
