const { spawn } = require('child_process');
const { Transform } = require('stream');

const selectOnlyInserts = (input) => {};

const getOnlyInserts = (chunk) => {
  // get only one line

  const lines = chunk.split('\n');

  // garder uniquement les lignes qui commence par un +
};

const gitDiff = spawn('git', ['diff', '**/*.md']);

const insertStream = new Transform({
  transform(chunk, encoding, callback) {
    console.log(chunk.toString());
    this.push(chunk.toString().toUpperCase());
    callback();
  },
});

gitDiff.stdout.pipe(insertStream);
