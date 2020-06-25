"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildFakeProofReadingReport = exports.buildFakeRawRawGrammarAndOrthographReport = void 0;
var buildReplacement = function (replacementValue) { return ({
    value: replacementValue,
}); };
exports.buildFakeRawRawGrammarAndOrthographReport = function (_a, repetition) {
    var message = _a.message, sentence = _a.sentence, replacementValue = _a.replacementValue;
    if (repetition === void 0) { repetition = 3; }
    var reports = [];
    for (var index = 0; index < repetition; index += 1) {
        reports.push({
            message: message,
            replacements: replacementValue ? [buildReplacement(replacementValue)] : [],
            sentence: sentence,
        });
    }
    return reports;
};
exports.buildFakeProofReadingReport = function (rawReports) { return rawReports.reduce(function (prev, current) {
    var _a;
    var filePath = current.filePath, message = current.message, replacementValue = current.replacementValue, sentence = current.sentence;
    return __assign(__assign({}, prev), (_a = {}, _a[filePath] = exports.buildFakeRawRawGrammarAndOrthographReport({ message: message, sentence: sentence, replacementValue: replacementValue }, 1), _a));
}, {}); };
