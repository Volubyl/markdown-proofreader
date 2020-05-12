const getReplacement = (replacementValue) => {
  return {
    value: replacementValue,
  };
};

const getReport = ({ message, sentence, replacementValue }, repetition = 3) => {
  const report = [];

  for (let index = 0; index < repetition; index += 1) {
    report.push({
      message,
      replacements: replacementValue ? [getReplacement(replacementValue)] : [],
      sentence,
    });
  }

  return report;
};

const getReports = (rawReports) => {
  return rawReports.reduce((prev, current) => {
    const { filePath, message, replacementValue, sentence } = current;
    return {
      ...prev,
      [filePath]: getReport({ message, sentence, replacementValue }, 1),
    };
  }, {});
};

module.exports = { getReport, getReplacement, getReports };
