const getNewlyInsertedText = require('./utils/stream.js');

getNewlyInsertedText().then((data) => {
  console.log(data);
});
