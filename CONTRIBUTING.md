# Contributing to Keyteki

Thank you for your interest in contributing to Keyteki! This document provides guidelines for contributing to the project.

## Getting Started

-   Fork the repository on GitHub
-   Clone your fork locally
-   Set up your development environment (see [Local Development](docs/local-development.md))
-   Create a branch for your changes

```bash
git clone https://github.com/YOUR_USERNAME/keyteki.git
cd keyteki
git remote add upstream https://github.com/keyteki/keyteki.git
git checkout -b my-feature-branch
```

## Ways to Contribute

### Bug Reports

Even if you don't code, playing games and reporting bugs helps a lot. Include:

-   Steps to reproduce the issue
-   Expected behavior
-   Actual behavior
-   Screenshots if applicable

### Bug Fixes

To fix a bug:

-   Check if an issue already exists
-   If not, create a new issue with steps to reproduce
-   If you want to fix it, mention that in the issue
-   If the fix is complicated, before writing code get feedback for your approach to fixing the issue in the [Discord channel #development](https://discord.com/channels/600996321763262464/600996321763262466)
-   Submit a PR referencing the issue

### Implementing Cards

Cards only need to be implemented when new sets come out. Join the [Discord channel #development](https://discord.com/channels/600996321763262464/600996321763262466) to coordinate with others before starting work on a card to avoid duplicate effort. See the documentation for details on how to implement cards:

-   [Implementing Cards](docs/implementing-cards.md) - Complete guide
-   [Card Abilities](docs/card-abilities.md) - Ability reference
-   [Game Actions](docs/game-actions.md) - Available actions
-   [Testing Cards](docs/testing-cards.md) - Writing tests

## Before Submitting Code

### Run Linting

All code must pass ESLint with no errors or warnings:

```bash
npm run lint
```

### Run Tests

All tests must pass:

```bash
npm test
```

For card implementations, write tests covering the card's abilities:

```bash
DEBUG_TEST=1 npm test -- test/server/cards/<Set>/<CardName>.spec.js
```

### Code Style

-   Follow the existing code style
-   The codebase uses **spaces, not tabs**
-   Check the `.eslintrc` file for detailed rules
-   Talk to maintainers before engaging in large refactors

## Submitting a Pull Request

### Commit Your Changes

```bash
git add <files>
git commit -m "Brief description of changes"
git push origin my-feature-branch
```

### Create the PR

Use GitHub to create a pull request from your branch. Include a description of the changes being made and reference any related issues.

## Communication

### Discord

Join the [Keyteki Discord Server](https://discord.gg/NncEXAs) to:

-   Coordinate with other contributors
-   Ask questions about the codebase
-   Announce what you're working on to avoid duplicate effort

### Posting in Dev Chat

Before starting work on a card, post in the dev chat to avoid duplicating work with other contributors.

## Code of Conduct

-   Be respectful and constructive
-   Follow Microsoft content policies
-   Avoid harmful, hateful, or inappropriate content
