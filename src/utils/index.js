const { replace, startsWith } = require('lodash/fp');
const remark = require('remark');
const strip = require('strip-markdown');

// We are only intersted by strings beginning by '+' and not by those beginning by '++'
const isGitInsert = (input) => /^\+[^+]/.test(input);

// Git prepend the inserted lines with a '+' sign
const removeGitInsertSign = (input) => replace('+', '', input);

// We are only intersted by new files.
// 'git status -s' (-s for short summary) prepend new files path with an A
const isNewFile = (input) => startsWith('A', input);
const replaceGitStatusSign = (input) => replace('A', '', input);

// Proofreading APIs have a quota limited in number of characters.
// We only want to check the content not the markdown layout
const stripMarkdown = (markdownText) => {
  let data;
  remark()
    .use(strip)
    .process(markdownText, (err, cleanData) => {
      if (err) throw err;
      data = cleanData;
    });

  return String(data);
};

const trim = (x) => x.trim();
const removeNewLign = (x) => x.replace('\n', '');

module.exports = {
  isGitInsert,
  removeGitInsertSign,
  removeNewLign,
  isNewFile,
  replaceGitStatusSign,
  stripMarkdown,
  trim,
};
