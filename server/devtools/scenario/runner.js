/*
 * Scenario runner: lets a dev point at a vitest integration spec file and
 * boot a live game on the running game node pre-configured to the same
 * state as one of the spec's `it(...)` tests.
 *
 * SCENARIO format:  path/to/foo.spec.js[#test name]
 *
 * The fragment is a case-insensitive substring match against the joined
 * describe/it labels. If omitted and the file has multiple tests, the first
 * is used (with a warning).
 */

// @ts-nocheck

const path = require('path');
const { randomUUID } = require('node:crypto');

const Game = require('../../game/game.js');
const Settings = require('../../settings.js');
const logger = require('../../log.js');
const DeckBuilder = require('../../../test/helpers/deckbuilder.js');
const PlayerInteractionWrapper = require('../../../test/helpers/playerinteractionwrapper.js');
const { cardCamel, getChatString } = require('../../../test/helpers/chat-utils.js');
const { applySetupTest } = require('../../../test/helpers/setupTest.js');

const deckBuilder = new DeckBuilder();
const cardsByCode = {};
for (const card of deckBuilder.cards) {
    cardsByCode[card.id] = card;
}

const PLAYER_NAMES = ['test0', 'test1'];

// Sentinel thrown by `this.scenarioBreak()` inside a test body. Caught by
// runScenario so partial test execution stops cleanly at the break point.
const SCENARIO_BREAK = Symbol('scenarioBreak');

// Returns a chainable no-op so spec files can call `expect(...).toBe(...)`
// without vitest present.
function makeNoopExpect() {
    const handler = {
        get: () => proxy,
        apply: () => proxy
    };
    const proxy = new Proxy(function () {}, handler);
    return proxy;
}

function makeUser(username) {
    return Settings.getUserWithDefaultsSet({
        username,
        settings: { optionSettings: { orderForcedAbilities: true } }
    });
}

function buildGameDetails(gameId) {
    const ownerUser = makeUser(PLAYER_NAMES[0]);
    const opponentUser = makeUser(PLAYER_NAMES[1]);
    return {
        name: 'Scenario',
        id: gameId,
        owner: ownerUser,
        saveGameId: gameId,
        allowSpectators: true,
        players: [
            { id: `scenario-${PLAYER_NAMES[0]}`, user: ownerUser },
            { id: `scenario-${PLAYER_NAMES[1]}`, user: opponentUser }
        ]
    };
}

function dryLoad(absPath) {
    // Install global stubs so spec files (which call describe/it/beforeEach at
    // module top-level) can be required without vitest present.
    const root = { name: '', beforeEach: [], afterEach: [], children: [], its: [] };
    const stack = [root];
    const describeImpl = function (name, fn) {
        const suite = { name, beforeEach: [], afterEach: [], children: [], its: [] };
        stack[stack.length - 1].children.push(suite);
        stack.push(suite);
        try {
            fn.call({});
        } finally {
            stack.pop();
        }
    };
    describeImpl.skip = function () {};
    describeImpl.only = describeImpl;
    const itImpl = function (name, fn) {
        stack[stack.length - 1].its.push({ name, fn });
    };
    itImpl.skip = function () {};
    itImpl.only = itImpl;
    const beforeEachImpl = function (fn) {
        stack[stack.length - 1].beforeEach.push(fn);
    };
    const afterEachImpl = function (fn) {
        stack[stack.length - 1].afterEach.push(fn);
    };

    const prev = {
        describe: global.describe,
        it: global.it,
        beforeEach: global.beforeEach,
        afterEach: global.afterEach,
        vi: global.vi
    };
    global.describe = describeImpl;
    global.it = itImpl;
    global.beforeEach = beforeEachImpl;
    global.afterEach = afterEachImpl;
    global.vi = makeNoopExpect();

    try {
        delete require.cache[absPath];
        require(absPath);
    } finally {
        global.describe = prev.describe;
        global.it = prev.it;
        global.beforeEach = prev.beforeEach;
        global.afterEach = prev.afterEach;
        if (prev.vi === undefined) {
            delete global.vi;
        } else {
            global.vi = prev.vi;
        }
    }

    const tests = [];
    (function collect(suite, parentName, parentHooks) {
        const name = parentName ? `${parentName} > ${suite.name}` : suite.name;
        const hooks = parentHooks.concat(suite.beforeEach);
        for (const it of suite.its) {
            tests.push({
                fullName: name ? `${name} > ${it.name}` : it.name,
                hooks,
                body: it.fn
            });
        }
        for (const child of suite.children) {
            collect(child, name, hooks);
        }
    })(root, '', []);

    return { tests };
}

/**
 * Inspect a spec file without running it. Returns the list of `it()` tests so
 * callers (e.g. the interactive CLI) can present a picker.
 * @param {string} scenarioPath
 * @returns {{ tests: { fullName: string }[] }}
 */
function inspectScenario(scenarioPath) {
    const abs = path.resolve(scenarioPath);
    const { tests } = dryLoad(abs);
    return {
        tests: tests.filter(usesSetupTest).map((t) => ({ fullName: t.fullName }))
    };
}

// Scenario mode requires the test to build a game via `setupTest`. Tests that
// don't (unit-style specs with mocks) can't be replayed on a live node — both
// the picker and direct SCENARIO loads guard against them so the user either
// doesn't see them or gets an explanatory error instead of a stuck game.
function usesSetupTest(test) {
    const sources = [test.body, ...test.hooks].map((fn) => {
        try {
            return fn.toString();
        } catch {
            return '';
        }
    });
    return sources.some((src) => src.includes('setupTest'));
}

function loadScenario(scenarioPathInput) {
    // SCENARIO format:  path/to/foo.spec.js[#test name]
    // The fragment is a case-insensitive substring match against the test's
    // full name (joined describe/it labels).
    const hashIdx = scenarioPathInput.indexOf('#');
    const rawPath = hashIdx === -1 ? scenarioPathInput : scenarioPathInput.slice(0, hashIdx);
    const testName = hashIdx === -1 ? null : scenarioPathInput.slice(hashIdx + 1);
    const abs = path.resolve(rawPath);

    const { tests } = dryLoad(abs);

    if (tests.length === 0) {
        throw new Error(`Scenario at ${abs} must register at least one it() test`);
    }

    let chosen;
    if (testName) {
        const needle = testName.toLowerCase();
        const matches = tests.filter((t) => t.fullName.toLowerCase().includes(needle));
        if (matches.length === 0) {
            const list = tests.map((t) => `  - ${t.fullName}`).join('\n');
            throw new Error(`No test matching "${testName}" in ${abs}. Available:\n${list}`);
        }
        chosen = matches[0];
        if (matches.length > 1) {
            logger.warn(
                `Multiple tests match "${testName}" in ${abs}; running first: ${chosen.fullName}`
            );
        }
    } else {
        chosen = tests[0];
        if (tests.length > 1) {
            logger.warn(
                `Multiple it() tests in ${abs}; running first: ${chosen.fullName} (append #<name> to select)`
            );
        }
    }

    if (!usesSetupTest(chosen)) {
        throw new Error(
            `Scenario test "${chosen.fullName}" in ${abs} does not call setupTest() and cannot be replayed on a live node. Pick a test that builds its game via setupTest.`
        );
    }

    return function () {
        for (const hook of chosen.hooks) {
            hook.call(this);
        }
        const result = chosen.body.call(this);
        if (result && typeof result.then === 'function') {
            logger.warn(
                `Scenario test "${chosen.fullName}" returned a Promise; async tests are not awaited in scenario mode`
            );
        }
    };
}

function buildFlow(game) {
    const player1 = new PlayerInteractionWrapper(game, game.getPlayerByName(PLAYER_NAMES[0]));
    const player2 = new PlayerInteractionWrapper(game, game.getPlayerByName(PLAYER_NAMES[1]));

    const flow = {
        game,
        player1,
        player2,
        allPlayers: [player1, player2],
        startGame() {
            game.initialise();
            if (game.gameFormat === 'adaptive-bo1') {
                player1.clickPrompt(player2.name + "'s deck");
                player2.clickPrompt(player2.name + "'s deck");
                player1.clickPrompt('2');
                player2.clickPrompt('Pass');
            }
            game.activePlayer = player1.player;
            game.firstPlayer = player1.player;
            player1.clickPrompt('Start the Game');
            player2.clickPrompt('Start the Game');
        },
        keepCards() {
            if (game.currentPhase !== 'setup') {
                throw new Error(`keepCards() expected setup phase but was ${game.currentPhase}`);
            }
            player1.clickPrompt('Keep Hand');
            player2.clickPrompt('Keep Hand');
        },
        selectFirstPlayer(player) {
            player.clickPrompt(player.name);
        },
        getChatLogs(numBack = 1, reverse = true) {
            const results = [];
            for (let i = 0; i < game.messages.length && i < numBack; i++) {
                let result = '';
                const msg = game.messages[game.messages.length - 1 - i];
                for (const frag of msg.message) {
                    result += getChatString(frag);
                }
                results.push(result);
            }
            return reverse ? results.reverse() : results;
        },
        getChatLog(numBack = 0) {
            const messages = flow.getChatLogs(numBack + 1, false);
            return messages.length && messages[numBack] ? messages[numBack] : '<No Message Found>';
        }
    };

    return flow;
}

function buildContext(game) {
    const flow = buildFlow(game);

    const context = {
        flow,
        game,
        player1: flow.player1,
        player2: flow.player2,
        player1Object: game.getPlayerByName(PLAYER_NAMES[0]),
        player2Object: game.getPlayerByName(PLAYER_NAMES[1])
    };

    for (const method of [
        'startGame',
        'selectFirstPlayer',
        'keepCards',
        'getChatLogs',
        'getChatLog'
    ]) {
        context[method] = (...args) => flow[method](...args);
    }

    context.buildDeck = (faction, cards) => deckBuilder.buildDeck(faction, cards);
    context.cardCamel = cardCamel;

    // Tests can call `this.scenarioBreak?.()` to halt scenario execution at
    // that point. The `?.` makes it a no-op when run under vitest.
    context.scenarioBreak = () => {
        throw SCENARIO_BREAK;
    };

    context.setupTest = function (options = {}) {
        applySetupTest(options, {
            game,
            player1: flow.player1,
            player2: flow.player2,
            startGame: flow.startGame,
            keepCards: flow.keepCards,
            deckBuilder,
            cardRegistry: context,
            playerNames: PLAYER_NAMES,
            prepareDeck: (deck, idx) => {
                // Default to CotA so the identity card image renders a real
                // set icon.
                deck.expansion = deck.expansion || 341;
                // A uuid is required for the player bar to render house icons.
                deck.uuid = deck.uuid || `scenario-${PLAYER_NAMES[idx]}-deck`;
            }
        });
    };

    return context;
}

/**
 * Build a Game from a scenario file and return it ready to be registered.
 *
 * @param {string} scenarioPath - absolute or workspace-relative path to scenario module
 * @param {object} options
 * @param {object} options.router - GameServer (or compatible) used as the Game's router
 * @param {string} [options.gameId] - reuse an existing game id (used by /reset)
 * @returns {import("../game/game")} the constructed Game
 */
function runScenario(scenarioPath, { router, gameId } = {}) {
    if (!router) {
        throw new Error('runScenario requires a router');
    }

    const scenarioFn = loadScenario(scenarioPath);
    const details = buildGameDetails(gameId || randomUUID());

    const game = new Game(details, { router, cardData: cardsByCode });
    game.scenarioPath = scenarioPath;
    game.started = true;
    game.startedAt = new Date();

    for (const player of game.getPlayers()) {
        game.setWins(player.name, 0);
    }

    const context = buildContext(game);
    const prevExpect = global.expect;
    global.expect = makeNoopExpect();
    let hitBreak = false;
    try {
        scenarioFn.call(context);
    } catch (e) {
        if (e !== SCENARIO_BREAK) throw e;
        hitBreak = true;
    } finally {
        if (prevExpect === undefined) {
            delete global.expect;
        } else {
            global.expect = prevExpect;
        }
    }

    const baseAlert = `Scenario loaded from ${path.basename(scenarioPath).replace('#', ' #')}`;
    game.addAlert('info', hitBreak ? `${baseAlert} (stopped at scenarioBreak)` : baseAlert);
    logger.info(`Scenario '${scenarioPath}' loaded as game ${game.id}`);

    return game;
}

module.exports = { runScenario, inspectScenario, loadScenario, PLAYER_NAMES, SCENARIO_BREAK };
