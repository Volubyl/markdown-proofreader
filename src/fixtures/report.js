const getReport = (message, value, sentence) => {
  return [
    {
      message,
      replacements: [
        {
          value,
        },
      ],
      sentence,
    },
    {
      message,
      replacements: [
        {
          value,
        },
      ],
      sentence,
    },
    {
      message,
      replacements: [
        {
          value,
        },
      ],
      sentence,
    },
  ];
};
module.exports = getReport;
