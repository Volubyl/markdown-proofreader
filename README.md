# Markdown Proofreader

## Motivation

Because during the COVID-19 quarantine I wrote tons of Markdown files (such as README.md). Mostly in bad english...
I was looking for a simple solution to check the syntax and grammar of those notes.

## Technologies

`markdown-proofreader` is built :

- on top of [Grammar Bot API](https://www.grammarbot.io/) for proof reading purpose 
- with [Highland.js](https://highlandjs.org/) for handling streams
- with eslint/prettier combo AirBnB flavor 

## Instalation

**Warning** :
- Markdown Proofreader requires you use `git` as version control software.
- Grammar Bot requires you to provide a valid 'API_ACCESS_KEY'. You can get an API Key by registering to Grammar Bot (it's free)

Run `npm install markdown-proofreader`.

## How to use ?

It works great during your test process or as a git hook.

### With new files

1. Write your next best-seller essai or the documentation of your anti COVID-19 software in plain Mardown
2. Track the changes (`git add`)
3. Run `markdown-proofreader -key (--API-KEY) <YOUR_GRAMMAR_BOT_API_KEY>`
4. Get your report

### With updated files

1. Update your files
2. Track the changes (`git add`)
3. Run `markdown-proofreader -key (--API-KEY) <YOUR_GRAMMAR_BOT_API_KEY>`
4. Get your report

(only the updates will be considered, not the deletion)

It work also great during your test process or as a git hook.

## How does it work ?

`markdown-proofreader` will perfom a `git diff --cached` on your markdown files, strip the markdown and send the content to GrammarBot API.


## FAQ

### Do you work for GrammarBot ?

Nope. I'm not working for GrammarBot or get any money/goodies/support from them. I just made few ressearch on DuckDuckGo and found that API. I will try to integrate other APIs in a future release.

### You don't like human proofreader ?
Yes I really do. But unfortunately, I'm still too broke to hire a reviewer for every text I write. But yes, please hire **REAL HUMANS**.

### I found mistakes in this README ...

One point for hiring real humans ...

## How to contribute

`markdown-proofreader` is a baby project in its early stage. Few bugs lies certainly in the shadow and many functionalities are certainly missing.

Feel free to open an issue or a PR

