# Keyteki

Web based implementation of Keyforge: the Unique Deck Game

## FAQ

### What is it?

This is the respository for the code internally known as keyteki which is running on [thecrucible.online](https://thecrucible.online/) allowing people to play KeyForge online using only their browser

### Doesn't this look a lot like Jinteki/Throneteki? The Android netrunner/AGOT online experience?

Glad you noticed! Yes, jinteki was a huge inspiration for this project, as the interface is clean and user friendly, so I've tried to make this similar in a lot of ways

Keyteki is a fork of the ringteki sourcecode

### Can I contribute?

Sure! The code is written in node.js(server) and react.js(client). Feel free to make suggestions, implement new cards, refactor bits of the code that are a bit clunky(there's a few of those atm), raise pull requests or submit bug reports

If you are going to contribute code, try and follow the style of the existing code as much as possible and talk to me before engaging in any big refactors. Also bear in mind there is an .eslintrc file in the project so try to follow those rules.

[Documentation for implementing cards](https://github.com/keyteki/keyteki/blob/master/docs/implementing-cards.md)

There is also a list of events raised by the code [here](https://github.com/keyteki/keyteki/blob/master/server/game/Events/types.js). If you're writing abilities which listen for these events, it tells you what parameters the event has and whether it has a handler. If you're writing code which calls any of these events, please make sure you pass the same parameters.

The biggest help at the moment would be in terms of CSS, as that's a bit of a weakness of mine, feel free to pick up any of the issues tagged 'CSS' in the issue list.

If you're not coding inclined, then just playing games on the site, and reporting bugs and issues that you find is a big help

### X Y Z doesn't work

That's not a question, but that still sucks, sorry :( First, bear in mind the site is in its infancy so a lot of things aren't implemented yet, but you should be able to do most things with a bit of manual input. If there's anything you can't do that you need to be able to do, let me know by raising an issue.

See this document for features I have planned and a link to the currently implemented cards:

### How do I do X Y Z?

Check out the [About page](https://thecrucible.online/about) of Keyteki live deployment.

## Development

### Docker

If you have docker installed, you can use the containerised version of the site.

#### MACOS Setup

[Install Docker
Desktop](https://docs.docker.com/desktop/setup/install/mac-install/), which
includes the `docker` command line tool and the `docker-compose` plugin.

Install [nvm](https://github.com/nvm-sh/nvm), [asdf](https://asdf-vm.com/), or
another tool to manage your Node versions. **Follow your tool’s steps to
download and install Node v16.20.2.**

(If you’re using `asdf`, add `legacy_version_file = yes` to your `$HOME/.asdfrc`
to automatically read the `.node-version` file in this repo.)

Clone the repository, then run the following commands:

```
git submodule init
git submodule update

node --version
# should output 16.20.2

npm --version
# should output 8.19.4 or thereabouts

npm install

docker compose up --build
```

In another terminal, run the following command:

```
docker compose exec lobby node server/scripts/fetchdata
```

It is normal to see “Failed to add card” log errors about duplicates at the
beginning.

Fetchdata takes a while to run, and some images may error out due to API rate
limits. If that happens, run it again. It will be faster the second time. Once
finished, restart the server.

You can now proceed to the Running and Testing section!

#### Running with Hybrid Setup (Docker services + Local Node server)

A hybrid setup is necessary to run the client in development mode. This enables
hot reloading, as well as in-browser development tools like React DevTools and
Redux DevTools.

If you want to run the Node.js server locally while using Docker for Redis and PostgreSQL:

1. Start only the database services:

```bash
docker-compose up -d redis postgres
```

2. Update `config/default.json5` to point to localhost:

```javascript
redisUrl: 'redis://localhost:6379/',
dbUser: 'keyteki',
dbHost: 'localhost',
dbDatabase: 'keyteki',
dbPassword: 'changemeplease',
dbPort: 54320,
```

3. Run the Node.js server locally:

```bash
npm start
```

4. In another window, run the game node server locally:

```bash
npm run game
```

#### Troubleshooting

```bash
# If you get memory allocation errors:
docker builder prune
```

If `package-lock.json` changes when you `npm install` despite not making any
changes to `package.json`, you are likely running with the wrong version of Node
and npm. Make sure that Node is 16.20.2 and that npm is in version 8.

If you get `dlopen` errors when running `npm start` outside of a container, it
is likely that your node modules were installed from within a container, which
caused them to build with a different architecture. Deleting the packages from
`node_modules` and re-running `npm install` outside of the container should
fix it.

### Non Docker

#### Required Software

-   Git
-   Node.js v16.20.2
-   PostgreSQL
-   Redis

Clone the repository, then run the following commands:

```
git submodule init
git submodule update
npm install
mkdir server/logs
```

Create config/local.json5 and put the following in it:

```
{
    dbHost: 'localhost',
    mqHost: 'localhost',

    lobby: {
        port: 4000
    },

    gameNode: {
        hostname: 'localhost'
    }
}
```

Run the following commands:

```
node server/scripts/fetchdata.js
node .
node server/gamenode
```

There are two exectuable components and you'll need to configure/run both to run a local server. First is the lobby server and then there are game nodes. The default configurations assume you are running postgres locally on the default port. If you need to change any configurations, edit `config/default.json5` or create a `config/local.json5` configuration that overrides any desired settings.

To download all supported languages (not needed if you're running just a test / dev server):

```
node server/scripts/fetchdata.js --language=en
node server/scripts/fetchdata.js --language=es
node server/scripts/fetchdata.js --language=de
node server/scripts/fetchdata.js --language=fr
node server/scripts/fetchdata.js --language=it
node server/scripts/fetchdata.js --language=pl
node server/scripts/fetchdata.js --language=pt
node server/scripts/fetchdata.js --language=zh-hans
node server/scripts/fetchdata.js --language=zh-hant
```

For production:

```
npm run build-vendor
npm run build
NODE_ENV=production PORT=4000 node .
```

Then for each game node (typically one per CPU/core):

```
PORT={port} SERVER={node-name} node server/gamenode
```

### Running and Testing

The game server should be accessible by browsing to [localhost:4000](http://localhost:4000).

The docker setup creates a default 'admin' user, and test users 'test0' and 'test1', with the passwords set to 'password'.

You can register 2 or more users, to play against yourself.
They can have fake email addresses.
You can login as both users either from 2 different browsers, or by
using an incognito window.

These users will be normal (non-admin) users. To escalate a user to
the admin role requires manual edits to the database, but that
is not required for testing in-game functionality.

If you implement or make changes to a card, you can use manual mode
to add it to a deck from within a game. Use manual mode, and the command:

```
/add-card <card name>
```

Before you run the unit tests, be sure all the necessary dependencies are installed

```
npm install
```

Then, to run the tests:

```
npm test
```

To run a specific test, you can specify the file. To see game logs, set `DEBUG_TEST=1`:

```
DEBUG_TEST=1 npm test -- test/server/cards/01-Core/AFairGame.spec.js
```

### Coding Guidelines

All JavaScript code included in Keyteki should pass (no errors, no warnings)
linting by [ESLint](http://eslint.org/), according to the rules defined in
`.eslintrc` at the root of this repo. To manually check that that is indeed the
case install ESLint and run

```
npm run lint
```

from repository's root.

All tests should also pass. To run these manually do:

```
npm test
```

If you are making any game engine changes, these will not be accepted without unit tests to cover them.

### Discord Discusson

[Keyteki Discord Server](https://discord.gg/NncEXAs)
