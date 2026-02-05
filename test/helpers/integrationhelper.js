const _ = require('underscore');

require('./objectformatters.js');

const DeckBuilder = require('./deckbuilder.js');
const GameFlowWrapper = require('./gameflowwrapper.js');

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
        const pass = _.any(buttons, (button) => button === expected);

        return {
            pass,
            message: () => {
                if (pass) {
                    return `Expected ${actual.name} not to have prompt button "${expected}" but it did.`;
                } else {
                    const buttonText = _.map(buttons, (button) => '[' + button + ']').join('\n');
                    return `Expected ${actual.name} to have prompt button "${expected}" but it had buttons:\n${buttonText}`;
                }
            }
        };
    },
    toHavePromptCardButton: function (actual, card) {
        const buttons = actual.currentPrompt().buttons;

        if (_.isString(card)) {
            card = actual.findCardByName(card);
        }

        const pass = _.any(buttons, (button) => (button.card ? button.card.id : '') === card.id);

        return {
            pass,
            message: () => {
                if (pass) {
                    return `Expected ${actual.name} not to have prompt button "${card.name}" but it did.`;
                } else {
                    const buttonText = _.map(
                        buttons,
                        (button) => '[' + (button.card ? button.card.name : '') + ']'
                    ).join('\n');
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
        const pass = _.any(buttons, (button) => button.text === 'No');

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
        if (_.isString(card)) {
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
        if (_.isString(card)) {
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

beforeEach(function () {
    // Clear previous test context
    for (let key of Object.keys(testContext)) {
        delete testContext[key];
    }

    this.flow = new GameFlowWrapper(cardsByCode);

    this.game = this.flow.game;
    this.player1Object = this.game.getPlayerByName('player1');
    this.player2Object = this.game.getPlayerByName('player2');
    this.player1 = this.flow.player1;
    this.player2 = this.flow.player2;

    _.each(ProxiedGameFlowWrapperMethods, (method) => {
        this[method] = (...args) => this.flow[method].apply(this.flow, args);
    });

    this.buildDeck = function (faction, cards) {
        return deckBuilder.buildDeck(faction, cards);
    };

    this.cardCamel = function (card) {
        let split = card.id.split('-');
        for (let i = 1; i < split.length; i++) {
            split[i] = split[i].slice(0, 1).toUpperCase() + split[i].slice(1);
            // TODO Enable this and fix the tests it breaks
            // if (split[i].length === 1) {
            //     split[i] = split[i].toLowerCase();
            // }
        }
        return split.join('');
    };

    /**
     * Factory method. Creates a new simulation of a game.
     * @param {Object} [options = {}] - specifies the state of the game
     */
    this.setupTest = function (options = {}) {
        //Set defaults
        if (!options.player1) {
            options.player1 = {};
        }

        if (!options.player2) {
            options.player2 = {};
        }

        if (options.gameFormat) {
            this.game.gameFormat = options.gameFormat;
        }

        //Build decks
        this.player1.selectDeck(deckBuilder.customDeck(options.player1));
        this.player2.selectDeck(deckBuilder.customDeck(options.player2));

        this.startGame();
        //Setup phase

        this.keepCards();
        if (options.phase !== 'setup') {
            // Choose a house
            this.player1.clickPrompt(this.player1.currentButtons[0]);
            this.player1.endTurn();
            this.player2.clickPrompt(this.player2.currentButtons[0]);
            this.player2.endTurn();
            if (options.player1.house) {
                this.player1.clickPrompt(options.player1.house);
            }
        }

        //Player stats
        this.player1.amber = options.player1.amber;
        this.player2.amber = options.player2.amber;
        this.player1.keys = options.player1.keys;
        this.player2.keys = options.player2.keys;
        this.player1.chains = options.player1.chains;
        this.player2.chains = options.player2.chains;
        //Token card
        this.player1.token = options.player1.token;
        this.player2.token = options.player2.token;
        //Field
        this.player1.hand = [];
        this.player2.hand = [];
        this.player1.inPlay = options.player1.inPlay;
        this.player2.inPlay = options.player2.inPlay;
        //Conflict deck related
        this.player1.hand = options.player1.hand;
        this.player2.hand = options.player2.hand;
        this.player1.discard = options.player1.discard;
        this.player2.discard = options.player2.discard;
        this.player1.archives = options.player1.archives;
        this.player2.archives = options.player2.archives;

        for (let player of [this.player1, this.player2]) {
            let cards = ['inPlay', 'hand', 'discard', 'archives'].reduce(
                (array, location) => array.concat(player[location]),
                []
            );
            for (let card of cards) {
                // still allow access by token's name
                let camel = this.cardCamel(card.isToken() ? card.tokenCard() : card);
                if (!this[camel]) {
                    this[camel] = card;
                }
            }

            for (let prophecy of player.player.prophecyCards) {
                let camel = this.cardCamel(prophecy);
                if (!this[camel]) {
                    this[camel] = prophecy;
                }
            }
        }

        this.game.checkGameState(true);
    };
});

afterEach(function () {
    if (process.env.DEBUG_TEST && this.game?.getPlainTextLog) {
        // eslint-disable-next-line no-console
        console.info(this.game.getPlainTextLog());
    }
});
