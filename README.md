# Ringteki


Web based implementation of The Legend of the Five Rings LCG

## FAQ

### What is it?

This is the respository for the code internally known as ringteki which is running on [jigoku.online](https://jigoku.online/) allowing people to play L5R LCG online using only their browser

### Does't this look a lot like Jinteki/Throneteki? The Android netrunner/AGOT online experience?

Glad you noticed!  Yes, jinteki was a huge inspiration for this project, as the interface is clean and user friendly, so I've tried to make this similar in a lot of ways

Ringteki is a fork of the throneteki sourcecode

### Can I contribute?

Sure!  The code is written in node.js(server) and react.js(client).  Feel free to make suggestions, implement new cards, refactor bits of the code that are a bit clunky(there's a few of those atm), raise pull requests or submit bug reports

If you are going to contribute code, try and follow the style of the existing code as much as possible and talk to me before engaging in any big refactors.  Also bear in mind there is an .eslintrc file in the project so try to follow those rules.

[Documentation for implementing cards](https://github.com/gryffon/ringteki/blob/master/docs/implementing-cards.md)

The biggest help at the moment would be in terms of CSS, as that's a bit of a weakness of mine, feel free to pick up any of the issues tagged 'CSS' in the issue list.

If you're not coding inclined, then just playing games on the site, and reporting bugs and issues that you find is a big help

### X Y Z doesn't work
That's not a question, but that still sucks, sorry :(  First, bear in mind the site is in its infancy so a lot of things aren't implemented yet, but you should be able to do most things with a bit of manual input.  If there's anything you can't do that you need to be able to do, let me know by raising an issue.

See this document for features I have planned and a link to the currently implemented cards:  

### How do I do X Y Z?

Check out the [About page](https://jigoku.online/about)  of a Ringteki live deployment.

## Development

The game uses mongodb as storage so you'll need that installed and running.

```
Clone the repository
git submodule init
git submodule update
npm install # See https://github.com/JustinTulloss/zeromq.node/issues/283 for zmq errors on OS X
mkdir server/logs
node server/scripts/fetchdata.js
node .
node server/gamenode
```

There are two exectuable components and you'll need to configure/run both to run a local server.  First is the lobby server and then there are game nodes. The default configurations assume you are running mongo locally on the default port. If you need to change any configurations, edit `config/default.json5` or create a `config/local.json5` configuration that overrides any desired settings.   

For production:

```
npm run build
NODE_ENV=production PORT=4000 node .
```

Then for each game node (typically one per CPU/core):

```
PORT={port} SERVER={node-name} node server/gamenode
```

### Coding Guidelines

All JavaScript code included in Ringteki should pass (no errors, no warnings)
linting by [ESLint](http://eslint.org/), according to the rules defined in
`.eslintrc` at the root of this repo. To manually check that that is indeed the
case install ESLint and run

```
eslint client/ server/ test/
```

from repository's root.

All tests should also pass.  To run these manually do:

```
npm test
```

If you are making any game engine changes, these will not be accepted without unit tests to cover them.

### Sentry.io Project
[Sentry.io - RingTeki](https://sentry.io/ringteki-team/ringteki/)

### Build Status
[![Travis Build](https://travis-ci.org/gryffon/ringteki.svg?branch=master)](https://travis-ci.org/gryffon/ringteki)

### Discord Discusson
[Ringteki Discord Server](https://discord.gg/tMzhyND)
