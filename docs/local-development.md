# Local Development Setup

This guide covers setting up your local development environment for Keyteki.

## Table of Contents

- [Running Unit Tests](#running-unit-tests)
- [Prerequisites](#prerequisites)
- [Quick Start (Docker)](#quick-start-docker)
  - [macOS Setup](#macos-setup)
  - [Accessing the Site](#accessing-the-site)
- [Hybrid Setup (Docker + Local Node)](#hybrid-setup-docker--local-node)
- [Non-Docker Setup](#non-docker-setup)
  - [Required Software](#required-software)
  - [Setup Steps](#setup-steps)
- [Useful Commands](#useful-commands)
  - [Running Tests](#running-tests)
  - [Linting](#linting)
  - [In-Game Testing](#in-game-testing)
  - [Locales](#locales)
- [Troubleshooting](#troubleshooting)
  - [Memory Allocation Errors](#memory-allocation-errors)
  - [package-lock.json Changes Unexpectedly](#package-lockjson-changes-unexpectedly)
  - [dlopen Errors](#dlopen-errors)
  - [Git Submodule Issues](#git-submodule-issues)

## Running Unit Tests

For running unit tests, see [Testing Cards](testing-cards.md). It is not necessary to run the full server to run unit tests, and the majority of development can be done by running tests directly.

## Prerequisites

- Git
- Node.js v16.20.2
- Docker (recommended) or PostgreSQL + Redis

## Quick Start (Docker)

Docker is the recommended approach for local development.

### macOS Setup

- Install [Docker Desktop](https://docs.docker.com/desktop/setup/install/mac-install/)

- Install a Node version manager ([nvm](https://github.com/nvm-sh/nvm) or [asdf](https://asdf-vm.com/))

- Install Node v16.20.2:

  ```bash
  # Using nvm
  nvm install 16.20.2
  nvm use 16.20.2

  # Using asdf (add `legacy_version_file = yes` to ~/.asdfrc first)
  asdf install nodejs 16.20.2
  ```

- Clone and set up the repository:

  ```bash
  git clone https://github.com/keyteki/keyteki.git
  cd keyteki
  git submodule init
  git submodule update
  npm install
  ```

- Start the server:

  ```bash
  docker-compose up --build
  ```

- In another terminal, fetch the card data:

  ```bash
  docker-compose exec lobby node server/scripts/fetchdata
  ```

  > Note: It's normal to see "Failed to add card" errors about duplicates at the beginning. If images fail due to rate limits, run the command again.

- Restart the server after fetchdata completes.

  ```bash
  docker-compose restart
  ```

### Accessing the Site

- Browse to [http://localhost:4000](http://localhost:4000)
- Default users: `admin`, `test0`, `test1` (password: `password`)

## Hybrid Setup (Docker + Local Node)

For hot reloading and React DevTools, run Node locally while using Docker for databases:

- Start database services only:

  ```bash
  docker-compose up -d redis postgres
  ```

- Update `config/default.json5` so the server connects to the containerized databases:

  ```javascript
  redisUrl: 'redis://localhost:6379/',
  dbUser: 'keyteki',
  dbHost: 'localhost',
  dbDatabase: 'keyteki',
  dbPassword: 'changemeplease',
  dbPort: 54320,
  ```

- Run the lobby server:

  ```bash
  npm start
  ```

- In another terminal, run the game node:

  ```bash
  npm run game
  ```

## Non-Docker Setup

### Required Software

- Git
- Node.js v16.20.2
- PostgreSQL
- Redis

### Setup Steps

- Clone and initialize:

  ```bash
  git clone https://github.com/keyteki/keyteki.git
  cd keyteki
  git submodule init
  git submodule update
  npm install
  mkdir server/logs
  ```

- Create `config/local.json5`:

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

- Fetch card data and start servers:

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
node --version   # Should be 16.20.2
npm --version    # Should be ~8.19.4
```

### dlopen Errors

Node modules were built for a different architecture (e.g., built inside Docker but running outside). Fix:

```bash
rm -rf node_modules
npm install
```

### Git Submodule Issues

```bash
git submodule init
git submodule update
npm install
git submodule update --init --recursive
```
