const { spawn } = require('child_process');
const { Transform } = require('stream');

const { getOnlyGitInserts } = require('./utils');

const gitDiff = spawn('git', ['diff', '**/*.md']);

const insertStream = new Transform({
  transform(chunk, encoding, callback) {
    this.push(getOnlyGitInserts(chunk.toString()));
    callback();
  },
});

gitDiff.stdout.pipe(insertStream).pipe(process.stdout);
