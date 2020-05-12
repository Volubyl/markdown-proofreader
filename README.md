# Markdown Proofreader

## Motivation

Because during the COVID-19 quarantine I wrote tons of Markdown files (such as README.md). Mostly in bad english...
I was looking for a simple solution to check the syntax and grammar of those notes.

## Technologies

`markdown-proofreader` is built :

- on top of [Grammar Bot API](https://www.grammarbot.io/) for proofreading purpose 
- with [Highland.js](https://highlandjs.org/) for handling streams
- with [fast-glob](https://github.com/mrmlnc/fast-glob) to match only markdown files
- with eslint/prettier combo AirBnB flavor 

## Installation

**Warning** :
- Markdown Proofreader requires you use `git` as version control software.

Run `npm install markdown-proofreader`.

## How to use ?

`Markdown Proofreader` has currently two modes 

- Verification of files corresponding to a glob
- Verification of additions compared to the last commit

### Files corresponding to a glob (Default mode)

By default, Markdown proofreader will check all markdown files present in the repository.

Use `--match` flag to target specific files using a glob pattern.

Under the hood we are using `Fast Glob` to find pathnames that matched a provided pattern.

See [`fast-glob` documentation](https://github.com/mrmlnc/fast-glob) to learn more about the syntax.

### Check only addition mode

#### Working with new files

1. Write your next best-seller essai or the documentation of your anti COVID-19 software in plain Markdown
2. Track the changes (`git add`)
3. Run `markdown-proofreader --diff-only`
4. Get your report

#### Working with updated files

1. Update your files
2. Track the changes (`git add`)
3. Run `markdown-proofreader --diff-only`
4. Get your report

(only the updates will be considered, not the deletion)

## How does it work ?

`markdown-proofreader` will perfom a `git diff --cached` on your markdown files, strip the markdown and send the content to GrammarBot API.


## CLI options

- `--diff-only` : used to work in 'only-diff mode'  {optional}
- `--match` : used to provide a glob pattern to target only specific file (optional)


## FAQ

### Do you work for GrammarBot ?

Nope. I'm not working for GrammarBot or get any money/goodies/support from them. I just made few research on DuckDuckGo and found that API. I will try to integrate other APIs in a future release.

### You don't like human proofreader ?
Yes I really do. But unfortunately, I'm still too broke to hire a reviewer for every text I write. But yes, please hire **REAL HUMANS**.

### I found mistakes in this README ...

One point for hiring real humans ...

## How to contribute ?

`markdown-proofreader` is a baby project in its early stage. Few bugs lies certainly in the shadow and many functionalities are certainly missing.

Feel free to open an issue or a PR

