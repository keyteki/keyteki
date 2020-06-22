/* eslint camelcase: 0, no-invalid-this: 0 */

const _ = require('underscore');

require('./objectformatters.js');

const DeckBuilder = require('./deckbuilder.js');
const GameFlowWrapper = require('./gameflowwrapper.js');

const deckBuilder = new DeckBuilder();

const ProxiedGameFlowWrapperMethods = [
    'startGame',
    'selectFirstPlayer',
    'keepCards',
    'getChatLogs',
    'getChatLog'
];

var customMatchers = {
    toHavePrompt: function () {
        return {
            compare: function (actual, expected) {
                var result = {};
                var currentPrompt = actual.currentPrompt();
                result.pass = actual.hasPrompt(expected);

                if (result.pass) {
                    result.message = `Expected ${actual.name} not to have prompt "${expected}" but it did.`;
                } else {
                    result.message = `Expected ${actual.name} to have prompt "${expected}" but it had menuTitle "${currentPrompt.menuTitle}" and promptTitle "${currentPrompt.promptTitle}".`;
                }

                return result;
            }
        };
    },
    toHavePromptButton: function (util, customEqualityMatchers) {
        return {
            compare: function (actual, expected) {
                var buttons = actual.currentPrompt().buttons;
                var result = {};

                result.pass = _.any(buttons, (button) =>
                    util.equals(button.text, expected, customEqualityMatchers)
                );

                if (result.pass) {
                    result.message = `Expected ${actual.name} not to have prompt button "${expected}" but it did.`;
                } else {
                    var buttonText = _.map(buttons, (button) => '[' + button.text + ']').join('\n');
                    result.message = `Expected ${actual.name} to have prompt button "${expected}" but it had buttons:\n${buttonText}`;
                }

                return result;
            }
        };
    },
    toHavePromptCardButton: function (util, customEqualityMatchers) {
        return {
            compare: function (actual, card) {
                var buttons = actual.currentPrompt().buttons;
                var result = {};

                if (_.isString(card)) {
                    card = actual.findCardByName(card);
                }

                result.pass = _.any(buttons, (button) =>
                    util.equals(button.card ? button.card.id : '', card.id, customEqualityMatchers)
                );

                if (result.pass) {
                    result.message = `Expected ${actual.name} not to have prompt button "${card.name}" but it did.`;
                } else {
                    var buttonText = _.map(
                        buttons,
                        (button) => '[' + (button.card ? button.card.name : '') + ']'
                    ).join('\n');
                    result.message = `Expected ${actual.name} to have prompt button "${card.name}" but it had buttons:\n${buttonText}`;
                }

                return result;
            }
        };
    },
    toBeAbleToSelect: function () {
        return {
            compare: function (player, card) {
                if (_.isString(card)) {
                    card = player.findCardByName(card);
                }

                let result = {};

                result.pass = player.currentActionTargets.includes(card);

                if (result.pass) {
                    result.message = `Expected ${card.name} not to be selectable by ${player.name} but it was.`;
                } else {
                    result.message = `Expected ${card.name} to be selectable by ${player.name} but it wasn't.`;
                }

                return result;
            }
        };
    },
    toBeAbleToPlay: function () {
        return {
            compare: function (player, card) {
                if (_.isString(card)) {
                    card = player.findCardByName(card);
                }

                let result = {};

                result.pass = card.getLegalActions(player.player, false).length > 0;

                if (result.pass) {
                    result.message = `Expected ${card.name} not to be playable by ${player.name} but it was.`;
                } else {
                    result.message = `Expected ${card.name} to be playable by ${player.name} but it wasn't.`;
                }

                return result;
            }
        };
    },
    toHaveRecentChatMessage: function () {
        return {
            compare: function (game, msg, numBack = 1) {
                let result = {};
                let logs = game.getChatLogs(numBack);

                result.pass = logs.filter((lastMsg) => lastMsg.includes(msg)).length > 0;

                if (result.pass) {
                    result.message = `Expected ${msg} not to be in ${logs} but it was.`;
                } else {
                    result.message = `Expected '${msg}' to be in [${logs}] but it wasn't.`;
                }

                return result;
            }
        };
    }
};

beforeEach(function () {
    jasmine.addMatchers(customMatchers);
});

global.integration = function (definitions) {
    describe('integration', function () {
        beforeEach(function () {
            let cards = {};

            for (let card of deckBuilder.cards) {
                cards[card.id] = card;
            }

            this.flow = new GameFlowWrapper(cards);

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
                        let split = card.id.split('-');
                        for (let i = 1; i < split.length; i++) {
                            split[i] = split[i].slice(0, 1).toUpperCase() + split[i].slice(1);
                            // TODO Enable this and fix the tests it breaks
                            // if (split[i].length === 1) {
                            //     split[i] = split[i].toLowerCase();
                            // }
                        }

                        let camel = split.join('');
                        if (!this[camel]) {
                            this[camel] = card;
                        }
                    }
                }

                this.game.checkGameState(true);
            };
        });

        afterEach(function () {
            if (process.env.DEBUG_TEST) {
                // eslint-disable-next-line no-console
                console.info(this.game.getPlainTextLog());
            }
        });

        definitions();
    });
};
