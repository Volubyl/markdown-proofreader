const getReplacement = (replacementValue) => {
  return {
    value: replacementValue,
  };
};

const getReport = (message, sentence, replacementValue) => {
  return [
    {
      message,
      replacements: replacementValue ? [getReplacement(replacementValue)] : [],
      sentence,
    },
    {
      message,
      replacements: replacementValue ? [getReplacement(replacementValue)] : [],
      sentence,
    },
    {
      message,
      replacements: replacementValue ? [getReplacement(replacementValue)] : [],
      sentence,
    },
  ];
};
module.exports = { getReport, getReplacement };
