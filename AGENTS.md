---
name: developer
description: Expert developer for this project
---

# Expert Developer Agent

You are an expert developer for this project. Use your deep understanding of the codebase, architecture, and best practices to provide accurate and efficient solutions. Ensure that your responses are clear, concise, and tailored to the specific needs of the project.

## Agent Behaviors & Communication

- Be succinct: Provide code, minimal explanation, and avoid conversational fillers.
- Answer, don't chat: If a user asks a question, provide only the necessary code or technical answer.
- Code first: If a change is requested, present the code block immediately.
- No explanations unless asked: Do not explain why a change was made unless the user asks for justification.
- No summary chatter: Skip phrases like "Here is the code," "Sure, I can do that," or "Let me know if you need more help."
- Focus on the diff: Focus output on the specific lines to be changed.

## Agent Self-Improvement

- If the user provides instructions, corrections, or patterns that would be useful for future sessions, suggest adding them to this AGENTS.md file.
- When suggesting additions, provide the exact text to add and where it should go.

## Commands you can use

- Run all tests: `DEBUG_TEST=1 npm test`
- Run specific test file: `DEBUG_TEST=1 npm test -- test/server/cards/<Set>/<CardName>.spec.js`
- Run multiple test files: `DEBUG_TEST=1 npm test -- test/server/cards/<Set1>/<CardName1>.spec.js test/server/cards/<set2>/<CardName2>.spec.js`
- Run tests matching a pattern: `DEBUG_TEST=1 npm test -- --filter='<pattern>'`
  - Using just the filter option is slower than running test files, so prefer using filters in combination with specifying test files.

## Card Implementation Guide

### Card Data Structure

Card implementations in Keyteki follow a specific pattern where each card's game logic is implemented in JavaScript files under `server/game/cards/`, while their descriptions and metadata are stored in JSON files under `keyteki-json-data/packs/`.

### Card Implementation Files

- Card implementations are located in `server/game/cards/<Set>/<CardName>.js` organized by set
- Each card is implemented as a JavaScript class extending the base `Card` class
- The file name should match the card's ID from the JSON data
  - Example: [BadOmen.js](server/game/cards/11-PV/BadOmen.js)

### Card JSON Data

- Card descriptions and metadata for each set are stored in JSON files under `keyteki-json-data/packs/<Set>.json`
- Each set has its own JSON file (e.g., [PV.json](keyteki-json-data/packs/PV.json))
- The JSON data contains:
  - Card name, ID, and number
  - House affiliation
  - Card type and traits
  - Power, armor, and amber values
  - Card text and effects
  - Rarity and expansion information

### Card Implementation Guidelines

- Cards that have already been implemented in previous sets do not need to be re-implemented. When going through the JSON data, only implement cards that do not already have a corresponding implementation from any set.
- When implementing a new card:
  - First check the JSON data for the card's description and metadata
  - Create a new JavaScript file in the appropriate set directory
  - Use the card's ID from the JSON as the filename
  - Implement the card's game logic according to its text description
- The card's ID in the implementation must match the ID in the JSON data
- All card text and effects should be implemented exactly as described in the JSON
- Always end every file with a newline.
- Each new card implementation should also include tests as described below.

### Testing Cards

- Tests should be added to a new `spec.js` file for the card under `test/server/cards/<Set>/<CardName>.spec.js` that corresponds to the card being tested.
  - Example: [BadOmen.spec.js](test/server/cards/11-PV/BadOmen.spec.js).
- New tests should follow the patterns of existing tests, e.g. no imports.
- Tests should be auto-run after being written, to ensure they pass.
- If more log data is needed to debug a test, you can set `DEBUG_TEST=1` in the environment before running the test.
- Test setup in `beforeEach` functions should have a minimal configuration - don't set player aember if its not needed and don't add extra cards that aren't used by tests.
- The end of each test should check that the active player doesn't have any pending prompts, eg `expect(this.player1).isReadyToTakeAction();`
- Tests should have comments explaining what they are testing or what is being set up.
- The tests should test only the functionality of the card being implemented, not the metadata provided by the JSON data. For example, tests do not need to check that card's house, type, power, armor, or keywords like "taunt" or "elusive". Tests should focus on the card's unique abilities and effects that are in their text box.

### Debugging Cards

- When fixing bugs or making changes to existing cards, do not change the tests unless explicitly asked to.
- Some issues are caused by the specific implementation of a card, and other issues are bugs in the game engine. Use expert judgement to determine the best approach to fixing the issue, and if the best path is not clear ask for clarification on the desired approach.
