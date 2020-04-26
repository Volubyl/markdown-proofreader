const { spawn } = require('child_process');
const { Transform, Writable } = require('stream');
const remark = require('remark');
const strip = require('strip-markdown');

const { getOnlyGitInserts } = require('./utils');

const gitDiff = spawn('git', ['diff', '**/*.md']);

const getGitInsertsStream = new Transform({
  transform(chunk, encoding, callback) {
    const result = getOnlyGitInserts(chunk.toString());
    this.push(result);
    callback();
  },
});

const removeMarkdownStream = new Transform({
  transform(chunk, encoding, callback) {
    const dirtyChunk = chunk.toString();
    remark()
      .use(strip)
      .process(dirtyChunk, (err, cleanData) => {
        if (err) throw err;
        this.push(String(cleanData));
        callback();
      });
  },
});

let body = '';

const buildRequestBodyStream = new Writable({
  write(chunk, encoding, callback) {
    body += chunk.toString();
    callback();
  },
});

gitDiff.stdout
  .pipe(getGitInsertsStream)
  .pipe(removeMarkdownStream)
  .pipe(buildRequestBodyStream)
  .on('finish', () => {
    console.log(body);
  });
