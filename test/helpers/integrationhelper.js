// Fail tests if Node emits a circular-dependency warning during module load.
// These warnings ("Accessing non-existent property 'X' of module exports
// inside circular dependency") indicate a require cycle that can cause subtle
// runtime bugs (e.g. `instanceof` checks failing because a class hasn't
// finished loading).  Surfacing them as test failures keeps the require graph
// honest.
//
// Vitest reloads this setup file for every test file in a worker, so guard
// against installing the listener (and busting MaxListeners) more than once.
const __circularDepGuard = '__keyteki.circularDepWarningGuard';
if (!process[__circularDepGuard]) {
    process[__circularDepGuard] = true;
    process.on('warning', (warning) => {
        if (
            warning &&
            typeof warning.message === 'string' &&
            warning.message.includes('inside circular dependency')
        ) {
            throw new Error(`Circular require detected during module load: ${warning.message}`);
        }
    });
}

require('./objectformatters.js');

const DeckBuilder = require('./deckbuilder.js');
const GameFlowWrapper = require('./gameflowwrapper.js');
const { checkAllMessages } = require('./messagehelper.js');
const { cardCamel } = require('./chat-utils.js');
const { applySetupTest } = require('./setupTest.js');

const deckBuilder = new DeckBuilder();

// Pre-build cards dictionary once (used by GameFlowWrapper)
const cardsByCode = {};
for (let card of deckBuilder.cards) {
    cardsByCode[card.id] = card;
}

// Shared test context that simulates `this` binding for jasmine-style tests
const testContext = {};

// Wrap vitest's describe/it/beforeEach to bind `this` to testContext
// This allows existing tests using `this.player1`, `this.game`, etc. to work
const originalDescribe = describe;
const originalIt = it;
const originalBeforeEach = beforeEach;
const originalAfterEach = afterEach;

globalThis.describe = function (name, fn) {
    return originalDescribe(name, function () {
        return fn.call(testContext);
    });
};
globalThis.describe.skip = function (name, fn) {
    return originalDescribe.skip(name, function () {
        return fn.call(testContext);
    });
};
globalThis.describe.only = function (name, fn) {
    return originalDescribe.only(name, function () {
        return fn.call(testContext);
    });
};

globalThis.it = function (name, fn) {
    return originalIt(name, function () {
        return fn.call(testContext);
    });
};
globalThis.it.skip = function (name, fn) {
    return originalIt.skip(name, function () {
        return fn.call(testContext);
    });
};
globalThis.it.only = function (name, fn) {
    return originalIt.only(name, function () {
        return fn.call(testContext);
    });
};

globalThis.beforeEach = function (fn) {
    return originalBeforeEach(function () {
        return fn.call(testContext);
    });
};

globalThis.afterEach = function (fn) {
    return originalAfterEach(function () {
        return fn.call(testContext);
    });
};

const ProxiedGameFlowWrapperMethods = [
    'startGame',
    'selectFirstPlayer',
    'keepCards',
    'getChatLogs',
    'getChatLog'
];

const customMatchers = {
    toHavePrompt: function (actual, expected) {
        const currentPrompt = actual.currentPrompt();
        const pass = actual.hasPrompt(expected);

        return {
            pass,
            message: () =>
                pass
                    ? `Expected ${actual.name} not to have prompt "${expected}" but it did.`
                    : `Expected ${actual.name} to have prompt "${expected}" but it had menuTitle "${currentPrompt.menuTitle}" and promptTitle "${currentPrompt.promptTitle}".`
        };
    },
    toHavePromptImage: function (actual, expected) {
        const currentPrompt = actual.currentPrompt();
        const currentImage =
            !!currentPrompt &&
            currentPrompt.controls.length > 0 &&
            !!currentPrompt.controls[0].source
                ? currentPrompt.controls[0].source.image
                : 'none';
        const pass = actual.hasPromptImage(expected);

        return {
            pass,
            message: () =>
                pass
                    ? `Expected ${actual.name} not to have prompt image "${expected}" but it did.`
                    : `Expected ${actual.name} to have prompt image "${expected}" but it had "${currentImage}".`
        };
    },
    toHavePromptButton: function (actual, expected) {
        const buttons = actual.currentButtons;
        const pass = buttons.some((button) => button === expected);

        return {
            pass,
            message: () => {
                if (pass) {
                    return `Expected ${actual.name} not to have prompt button "${expected}" but it did.`;
                } else {
                    const buttonText = buttons.map((button) => '[' + button + ']').join('\n');
                    return `Expected ${actual.name} to have prompt button "${expected}" but it had buttons:\n${buttonText}`;
                }
            }
        };
    },
    toHavePromptCardButton: function (actual, card) {
        const buttons = actual.currentPrompt().buttons;

        if (typeof card === 'string') {
            card = actual.findCardByName(card);
        }

        const pass = buttons.some((button) => (button.card ? button.card.id : '') === card.id);

        return {
            pass,
            message: () => {
                if (pass) {
                    return `Expected ${actual.name} not to have prompt button "${card.name}" but it did.`;
                } else {
                    const buttonText = buttons
                        .map((button) => '[' + (button.card ? button.card.name : '') + ']')
                        .join('\n');
                    return `Expected ${actual.name} to have prompt button "${card.name}" but it had buttons:\n${buttonText}`;
                }
            }
        };
    },
    toBeAbleToRaiseTide: function (player) {
        player.game.clickTide(player.name);
        player.game.continue();
        player.checkUnserializableGameState();

        const buttons = player.currentPrompt().buttons;
        const pass = buttons.some((button) => button.text === 'No');

        if (pass) {
            player.clickPrompt('No');
        }

        return {
            pass,
            message: () =>
                pass
                    ? `Expected ${player.name} not to be able to raise the tide, but it was.`
                    : `Expected ${player.name} to be able to raise the tide, but it wasn't.`
        };
    },
    toBeAbleToSelect: function (player, card) {
        if (typeof card === 'string') {
            card = player.findCardByName(card);
        }

        const pass = player.currentActionTargets.includes(card);

        return {
            pass,
            message: () =>
                pass
                    ? `Expected ${card.name} not to be selectable by ${player.name} but it was.`
                    : `Expected ${card.name} to be selectable by ${player.name} but it wasn't.`
        };
    },
    toBeAbleToPlay: function (player, card) {
        if (typeof card === 'string') {
            card = player.findCardByName(card);
        }

        const pass = card.getLegalActions(player.player, false).length > 0;

        return {
            pass,
            message: () =>
                pass
                    ? `Expected ${card.name} not to be playable by ${player.name} but it was.`
                    : `Expected ${card.name} to be playable by ${player.name} but it wasn't.`
        };
    },
    toHaveAllChatMessagesBe: function (context, expectedMessages, options = {}) {
        return checkAllMessages(context, expectedMessages, options);
    },
    toHaveRecentChatMessage: function (game, msg, numBack = 1) {
        const logs = game.getChatLogs(numBack);
        const pass = logs.filter((lastMsg) => lastMsg.includes(msg)).length > 0;

        return {
            pass,
            message: () =>
                pass
                    ? `Expected ${msg} not to be in ${logs} but it was.`
                    : `Expected '${msg}' to be in [${logs}] but it wasn't.`
        };
    },
    isReadyToTakeAction: function (player) {
        const pass = player.hasPrompt('Choose a card to play, discard or use');

        return {
            pass,
            message: () => {
                if (pass) {
                    return `Expected ${player.name} not to be ready to take action, but it was.`;
                } else {
                    let currentPrompt = player.currentPrompt();
                    return `Expected ${player.name} to be ready to take action, but it had menuTitle "${currentPrompt.menuTitle}" and promptTitle "${currentPrompt.promptTitle}".`;
                }
            }
        };
    }
};

// Register custom matchers with vitest's expect.extend
expect.extend(customMatchers);

// Card / Player / Game objects have huge, deeply-cyclic reference graphs
// (Card -> controller -> game -> all players -> all cards -> events -> ...).
// When a `toEqual`/`toContain`/etc. assertion fails involving one of these,
// vitest's pretty-format diff serializer can take seconds to minutes and
// blow the heap trying to walk the graph.
//
// 1. addEqualityTesters: short-circuit equality with reference identity for
//    these classes. Two Cards are equal iff they are the same instance —
//    deep-equal of Card fields is meaningless and ruinously expensive.
// 2. addSnapshotSerializer: render them as short identifiers in any
//    serialized output (assertion diffs, snapshots) instead of recursing.
const Card = require('../../server/game/Card.js');
const Player = require('../../server/game/player.js');
const Game = require('../../server/game/game.js');

expect.addEqualityTesters([
    function gameObjectIdentityTester(a, b) {
        const isGameObject = (v) => v instanceof Card || v instanceof Player || v instanceof Game;
        if (isGameObject(a) || isGameObject(b)) {
            return a === b;
        }
        return undefined; // fall back to default deep equality
    }
]);

expect.addSnapshotSerializer({
    test: (val) => val instanceof Card || val instanceof Player || val instanceof Game,
    serialize: (val) => {
        if (val instanceof Card) {
            return `Card(${val.name}${val.location ? ' @ ' + val.location : ''})`;
        }
        if (val instanceof Player) {
            return `Player(${val.name})`;
        }
        return 'Game';
    }
});

// `addSnapshotSerializer` only affects snapshot matchers (toMatchSnapshot
// etc.) — assertion-failure diffs go through @vitest/utils' diff.js, which
// uses a fixed pretty-format plugin list with no extension hook. To prevent
// failure diffs from recursing through the entire game object graph (and
// blowing the heap when a `toEqual` against e.g. `cardsInPlay` fails), we
// install our serializer by wrapping one of the existing plugin references
// imported from @vitest/pretty-format. The plugin objects are shared by
// reference with diff.js's PLUGINS array, so mutating their `test`/
// `serialize` methods here is observed by both diff and snapshot paths.
const prettyFormatPlugins = require('@vitest/pretty-format').plugins;
const isGameObject = (v) => v instanceof Card || v instanceof Player || v instanceof Game;
const serializeGameObject = (val) => {
    if (val instanceof Card) {
        return `Card(${val.name}${val.location ? ' @ ' + val.location : ''})`;
    }
    if (val instanceof Player) {
        return `Player(${val.name})`;
    }
    return 'Game';
};
const targetPlugin = prettyFormatPlugins.AsymmetricMatcher;
if (!targetPlugin.__keytekiWrapped) {
    const originalTest = targetPlugin.test.bind(targetPlugin);
    const originalSerialize = targetPlugin.serialize.bind(targetPlugin);
    targetPlugin.test = (val) => isGameObject(val) || originalTest(val);
    targetPlugin.serialize = (val, ...rest) =>
        isGameObject(val) ? serializeGameObject(val) : originalSerialize(val, ...rest);
    targetPlugin.__keytekiWrapped = true;
}

beforeEach(function () {
    // Clear previous test context
    for (let key of Object.keys(testContext)) {
        delete testContext[key];
    }

    // `this.scenarioBreak()` is a no-op under vitest. In scenario mode
    // (loaded via server/devtools/scenario/runner.js), it halts test execution
    // at the call site so the dev can interact with the resulting game state.
    this.scenarioBreak = () => {};

    this.flow = new GameFlowWrapper(cardsByCode);

    this.game = this.flow.game;
    this.player1Object = this.game.getPlayerByName('player1');
    this.player2Object = this.game.getPlayerByName('player2');
    this.player1 = this.flow.player1;
    this.player2 = this.flow.player2;

    for (const method of ProxiedGameFlowWrapperMethods) {
        this[method] = (...args) => this.flow[method].apply(this.flow, args);
    }

    this.buildDeck = function (faction, cards) {
        return deckBuilder.buildDeck(faction, cards);
    };

    this.cardCamel = cardCamel;

    /**
     * Factory method. Creates a new simulation of a game.
     * @param {Object} [options = {}] - specifies the state of the game
     */
    this.setupTest = function (options = {}) {
        applySetupTest(options, {
            game: this.game,
            player1: this.player1,
            player2: this.player2,
            startGame: (...args) => this.startGame(...args),
            keepCards: (...args) => this.keepCards(...args),
            deckBuilder,
            cardRegistry: this
        });
    };
});

afterEach(function () {
    if (process.env.DEBUG_TEST && this.game?.getPlainTextLog) {
        // eslint-disable-next-line no-console
        console.info(this.game.getPlainTextLog());
    }
});
