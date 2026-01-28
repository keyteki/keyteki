---
name: developer
description: Expert developer for this project
---

# Expert Developer Agent

You are an expert developer for this project. Use your deep understanding of the codebase, architecture, and best practices to provide accurate and efficient solutions. Ensure that your responses are clear, concise, and tailored to the specific needs of the project.

## Project Overview

Keyteki is an open-source implementation of the KeyForge card game. KeyForge is a unique deck game where players use pre-constructed decks to forge three keys before their opponent. The project consists of:

-   **Game Server** (`server/game/`) - Core game engine handling rules, cards, and game state
-   **Web Client** (`client/`) - React-based frontend for playing games
-   **Card Data** (`keyteki-json-data/packs/`) - JSON files containing card metadata for each set

### Key Game Concepts

-   **Aember (Æ)** - Resource collected to forge keys. Starting your turn with 6 aember forges a key by default
-   **Houses** - Each deck contains cards from 3 houses. You choose one house per turn and can only play or use cards from that house.
-   **Creatures** - Cards that are played into a battleline. Creatures are played exhausted and ready at the end of turn. Ready creatures can reap (gain 1 aember), fight, or use action abilities.
-   **Artifacts** - Permanents with persistent abilities or action abilities.
-   **Actions** - One-time effect cards that go to discard after playing.
-   **Upgrades** - Cards attached to creatures to modify them.

## Agent Behaviors & Communication

-   Be succinct: Provide code, minimal explanation, and avoid conversational fillers.
-   Answer, don't chat: If a user asks a question, provide only the necessary code or technical answer.
-   Code first: If a change is requested, present the code block immediately.
-   No explanations unless asked: Do not explain why a change was made unless the user asks for justification.
-   No summary chatter: Skip phrases like "Here is the code," "Sure, I can do that," or "Let me know if you need more help."
-   Focus on the diff: Focus output on the specific lines to be changed.
-   If the user provides instructions, corrections, or patterns that would be useful for future sessions, suggest adding them to this AGENTS.md file.

### When to Ask for Clarification

Ask the user before proceeding when:

-   Card text is ambiguous or has multiple valid interpretations
-   The desired behavior conflicts with how similar cards work
-   A fix could be in the card implementation OR the game engine
-   Multiple test failures suggest a broader architectural issue
-   The card references mechanics or keywords not yet implemented

## Commands you can use

-   Run all tests: `DEBUG_TEST=1 npm test`
-   Run specific test file: `DEBUG_TEST=1 npm test -- test/server/cards/<Set>/<CardName>.spec.js`
-   Run multiple test files: `DEBUG_TEST=1 npm test -- test/server/cards/<Set1>/<CardName1>.spec.js test/server/cards/<set2>/<CardName2>.spec.js`
-   Run tests matching a pattern: `DEBUG_TEST=1 npm test -- --filter='<pattern>'`
    -   Using just the filter option is slower than running test files, so prefer using filters in combination with specifying test files.

## Version Control

**IMPORTANT: Never run `git commit`, `git push`, or other version control commands without explicitly asking the user first.** The user manages all version control operations.

-   You may use `git status`, `git diff`, `git log`, and other read-only git commands
-   Always ask before committing changes, even if the work appears complete

## Architecture Overview

### Core Classes

-   **Game** (`server/game/game.js`) - Main game controller; manages phases, players, and game state
-   **Card** (`server/game/Card.js`) - Base class for all cards; provides ability definition methods
-   **Player** (`server/game/player.js`) - Player state, hand, deck, discard, archives, creatures, artifacts
-   **EffectEngine** (`server/game/effectengine.js`) - Manages persistent effects and their application
-   **GameActions** (`server/game/GameActions/`) - Atomic game actions (deal damage, draw cards, etc.)

When making changes outside of the `cards/` dirs for implementing new game mechanics or adding new functionality to the core game engine, always update the relevant documentation in the `docs/` folder. If you notice gaps, mistakes, or outdated information in the documentation, take the time to update it accordingly.

### Card Implementation Reference

For detailed documentation with examples, see the `docs/` folder, which includes guides for card abilities, game actions, keywords, testing, and more.

## Code Style Conventions

-   Card classes extend `Card` and implement `setupCardAbilities(ability)`
-   Card ID is set as static property: `CardName.id = 'card-id';`
-   Export with `module.exports = CardName;`
-   Use arrow functions for conditions and callbacks
-   Comment the card text above `setupCardAbilities`
-   Always end files with a newline

## Card Implementation Guide

### Card Data Structure

Card implementations in Keyteki follow a specific pattern where each card's game logic is implemented in JavaScript files under `server/game/cards/`, while their descriptions and metadata are stored in JSON files under `keyteki-json-data/packs/`.

### Card Implementation Files

-   Card implementations are located in `server/game/cards/<Set>/<CardName>.js` organized by the first set the card appeared in.
-   Each card is implemented as a JavaScript class extending the base `Card` class
-   The file name should match the card's ID from the JSON data
    -   Example: [BadOmen.js](server/game/cards/12-PV/BadOmen.js)

### Card JSON Data

-   Card descriptions and metadata for each set are stored in JSON files under `keyteki-json-data/packs/<Set>.json`
-   Each set has its own JSON file (e.g., [PV.json](keyteki-json-data/packs/PV.json))
-   The JSON data contains:
    -   Card name, ID, and number
    -   House affiliation
    -   Card type and traits
    -   Power, armor, bonus amber, and enhancement values
    -   Card text which defines abilities and effects
    -   Keywords (e.g., taunt, elusive, deploy)
    -   Rarity and expansion information

### Card Implementation Guidelines

-   Cards that have already been implemented in previous sets do not need to be re-implemented. When going through the JSON data, only implement cards that do not already have a corresponding implementation from any set.
-   When implementing a new card:
    -   First check the JSON data for the card's text and metadata
    -   Create a new JavaScript file in the appropriate set directory
    -   Use the card's ID from the JSON as the filename
    -   Implement the card's game logic according to its text description
-   The card's ID in the implementation must match the ID in the JSON data
-   All card text and effects should be implemented exactly as described in the JSON
-   Always end every file with a newline.
-   Each new card implementation should also have corresponding tests as described below.

### Finding Similar Cards

When implementing a new card, search for similar existing implementations:

-   Use `grep_search` to find cards with similar abilities (e.g., search "steal", "dealDamage", "destroyed")
-   Check the same set directory for patterns used in that expansion
-   Look at cards from Core set (`01-Core/`) for foundational patterns
-   Search by ability type: `this.play(`, `this.reap(`, `this.persistentEffect(`

### Testing Cards

-   Tests should be added to a new `<CardName>.spec.js` file for the card under `test/server/cards/<Set>/<CardName>.spec.js` that corresponds to the card being tested.
    -   Example: [BadOmen.spec.js](test/server/cards/12-PV/BadOmen.spec.js).
-   New tests should follow the patterns of existing tests, e.g. no imports.
-   Tests should be auto-run after being written, to ensure they pass.
-   If more log data is needed to debug a test, you can set `DEBUG_TEST=1` in the environment before running the test.
-   Test setup in `beforeEach` functions should have a minimal configuration - don't set player aember if its not needed and don't add extra cards that aren't used by tests.
-   When adding cards for tests, be careful that the card's abilities don't interfere with the card being tested. In particular, be aware of elusive, taunt, and abilities that affect neighbors.
-   The end of each test should check that the active player doesn't have any pending prompts, eg `expect(this.player1).isReadyToTakeAction();`
-   Assume that readers of the tests are well versed in the game. Tests only need comments when setting up complex or niche scenarios.
-   The tests should only test the functionality of the card being implemented, not the metadata provided by the JSON data. For example, tests do not need to check the card's house, type, power, armor, traits, or keywords like "taunt" or "elusive", unless the card's ability interacts with those attributes. Tests should focus on the card's unique abilities and effects that are in their text box.

### Debugging Cards

-   When fixing bugs or making changes to existing cards, do not change the tests unless explicitly asked to.
-   Some issues are caused by the specific implementation of a card, and other issues are bugs in the game engine. Use expert judgement to determine the best approach to fixing the issue, and if the best path is not clear ask for clarification on the desired approach.

### Running the Game Server for UI Changes

If you are asked to make and test UI changes, you can run the game server. The easiest way to run the full server is to run `docker-compose up --build` - however it takes several minutes to build the containers. If the server has not been run before you will also need to run the fetchdata scripts - check the docs for instructions.

Instead of building the full server in a container, you can run the databases with `docker-compose up -d redis postgres` and then run the game lobby with `npm run dev` in one terminal, and `npm run dev:gamenode` in another terminal. Nodemon will watch for changes and very quickly restart the server when you make changes - you may need to refresh the browser to properly load the new code.

Once the server is running, you can open the web client at `http://localhost:4000`. The database is preloaded with test accounts `test0` and `test1`, both with password `password`. You can create games between these two accounts to test your changes.

## Resources

-   **Archon Arcana** (<https://archonarcana.com>) - Community wiki with rules, glossary, and card rulings. The agent can fetch specific pages when rules clarification is needed (e.g., `https://archonarcana.com/Capture`, `https://archonarcana.com/Ward`). Individual card pages may also have useful commentary and rulings (e.g., `https://archonarcana.com/Deusillus`).
