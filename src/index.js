const { getReport } = require('./utils/core');

getReport().then((data) => {
  console.log(data);
});
