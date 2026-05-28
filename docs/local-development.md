# Local Development Setup

This guide covers setting up your local development environment for Keyteki.

## Table of Contents

-   [Running Unit Tests](#running-unit-tests)
-   [Prerequisites](#prerequisites)
-   [Quick Start (Docker)](#quick-start-docker)
    -   [macOS Setup](#macos-setup)
    -   [Accessing the Site](#accessing-the-site)
-   [Hybrid Setup (Docker + Local Node)](#hybrid-setup-docker--local-node)
-   [Non-Docker Setup](#non-docker-setup)
    -   [Required Software](#required-software)
    -   [Setup Steps](#setup-steps)
-   [Useful Commands](#useful-commands)
    -   [Running Tests](#running-tests)
    -   [Linting](#linting)
    -   [In-Game Testing](#in-game-testing)
    -   [Locales](#locales)
-   [Troubleshooting](#troubleshooting)
    -   [Memory Allocation Errors](#memory-allocation-errors)
    -   [package-lock.json Changes Unexpectedly](#package-lockjson-changes-unexpectedly)
    -   [dlopen Errors](#dlopen-errors)
    -   [Git Submodule Issues](#git-submodule-issues)

## Running Unit Tests

For running unit tests, see [Testing Cards](testing-cards.md). It is not necessary to run the full server to run unit tests, and the majority of development can be done by running tests directly.

## Prerequisites

-   Git
-   Node.js v22.22.0
-   Docker (recommended) or PostgreSQL + Redis

## Quick Start (Docker)

Docker is the recommended approach for local development.

### macOS Setup

-   Install [Docker Desktop](https://docs.docker.com/desktop/setup/install/mac-install/)

-   Install a Node version manager ([nvm](https://github.com/nvm-sh/nvm) or [asdf](https://asdf-vm.com/))

-   Install Node v22.22.0:

    ```bash
    # Using nvm
    nvm install 22.22.0
    nvm use 22.22.0

    # Using asdf (add `legacy_version_file = yes` to ~/.asdfrc first)
    asdf install nodejs 22.22.0
    ```

-   Clone and set up the repository:

    ```bash
    git clone https://github.com/keyteki/keyteki.git
    cd keyteki
    git submodule init
    git submodule update
    npm ci
    ```

-   Start the server:

    ```bash
    docker compose up --build
    ```

-   In another terminal, fetch the card data:

    ```bash
    docker compose exec lobby node server/scripts/fetchdata
    ```

    > Note: It's normal to see "Failed to add card" errors about duplicates at the beginning. If images fail due to rate limits, run the command again.

-   Restart the server after fetchdata completes.

    ```bash
    docker compose restart
    ```

### Accessing the Site

-   Browse to [http://localhost:4000](http://localhost:4000)
-   Default users: `admin`, `test0`, `test1` (password: `password`)

## Hybrid Setup (Docker + Local Node)

For hot reloading and React DevTools, run Node locally while using Docker for databases:

-   Start database services only:

    ```bash
    npm run dev:db
    ```

-   The `config/default-node.json5` file contains overrides for connecting to the containerized databases from your local machine. The `dev:lobby` and `dev:gamenode` scripts set `NODE_APP_INSTANCE=node`, which causes node-config to load this file on top of `default.json5`.

-   Run the lobby server:

    ```bash
    npm run dev:lobby
    ```

    The lobby server uses Vite middleware for the client in development; no separate client dev server is needed.

-   In another terminal, run the game node:

    ```bash
    npm run dev:gamenode
    ```

## Non-Docker Setup

### Required Software

-   Git
-   Node.js v22.22.0
-   PostgreSQL
-   Redis

### Setup Steps

-   Clone and initialize:

    ```bash
    git clone https://github.com/keyteki/keyteki.git
    cd keyteki
    git submodule init
    git submodule update
    npm ci
    mkdir server/logs
    ```

-   Create `config/local.json5`:

    ```javascript
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

-   Fetch card data and start servers:

    ```bash
    node server/scripts/fetchdata.js
    node .
    node server/gamenode
    ```

## Useful Commands

### Running Tests

```bash
# Run all tests
npm test

# Run tests with debug output
DEBUG_TEST=1 npm test -- test/server/cards/CotA/AFairGame.spec.js
```

### Linting

```bash
npm run lint
```

### In-Game Testing

Use manual mode and the `/add-card` command to test cards:

```txt
/add-card Card Name
```

### Scenario Mode (Auto-Setup Games)

Boot the game node pre-configured to the state of any vitest integration
test — `test0` and `test1` drop directly into the game when they log in.

#### Interactive picker (recommended)

```bash
npm run dev:scenario
```

Two-stage fuzzy picker (VSCode-style subsequence matching, e.g. `achrbas` →
`AchromaticBasilisk.spec.js`):

1. **File** — every `test/server/**/*.spec.js`.
2. **Test** — the `it()` cases parsed from the file (skipped if the file has
   a single test).

After selecting, the game node boots. Keys: type to filter · ↑/↓ navigate ·
Enter select · **Esc** back one level · Ctrl+C exit. From the running
server, press **r** to reset the scenario (re-runs the test, hot-reloading
the file from disk) or **Esc** to return to the test picker so you can jump
between cases without restarting.

#### Manual `SCENARIO=` env var

```bash
SCENARIO='test/server/cards/14-DM/AchromaticBasilisk.spec.js#can target an already' \
  NODE_APP_INSTANCE=node npm run dev:gamenode
```

The fragment after `#` is a case-insensitive substring match against the
test's full name (joined describe/it labels). Omit the fragment to run the
first test in the file (warns if there are others). A non-matching fragment
errors out with a list of available test names.

#### Stopping mid-test with `scenarioBreak()`

Insert `this.scenarioBreak();` anywhere in a test body to halt scenario
execution at that point. The runner catches the sentinel, hands the
in-progress game to `test0`/`test1`, and flags it in the alert
(`stopped at scenarioBreak`). Everything before the call has run; everything
after is skipped — useful for inspecting a board state partway through a
test before the final assertions clean up.

Under vitest the call is a no-op (`integrationhelper.js` installs an empty
stub on the test context), so the test still passes normally. Even so,
**never commit `scenarioBreak()` calls** — they're a local debugging aid
only. The [`scenarioBreaks.spec.js`](../test/server/scenarioBreaks.spec.js)
guard scans `test/server/**/*.spec.js` and fails CI if any are found.

#### How it works

The runner dry-loads the spec with stubbed `describe`/`it`/`beforeEach`/`vi`,
finds the selected `it()`, then executes all inherited `beforeEach` hooks
followed by the `it` body against a context that mirrors `integrationhelper`:
`this.setupTest`, `this.player1`, `this.player2`, camelCased card references
(e.g. `this.flaxia`), `this.startGame`, `this.keepCards`, `this.getChatLog`,
`this.scenarioBreak`, etc. `expect(...)` is a no-op so assertions don't
crash.

### Locales

Use the following to download all supported languages - this is typically not needed unless you are working on localization:

```shell
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

## Troubleshooting

### Memory Allocation Errors

```bash
docker builder prune
```

### package-lock.json Changes Unexpectedly

You're likely running with the wrong Node version. Verify:

```bash
node --version   # Should be 22.22.0
npm --version    # Should be ~10.x
```

### dlopen Errors

Node modules were built for a different architecture (e.g., built inside Docker but running outside). Fix:

```bash
rm -rf node_modules
npm ci
```

### Git Submodule Issues

```bash
git submodule init
git submodule update
npm ci
git submodule update --init --recursive
```
