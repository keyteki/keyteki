/* global describe, beforeEach, jasmine */
/* eslint camelcase: 0, no-invalid-this: 0 */

const _ = require('underscore');

require('./objectformatters.js');

const DeckBuilder = require('./deckbuilder.js');
const GameFlowWrapper = require('./gameflowwrapper.js');

const deckBuilder = new DeckBuilder();

const ProxiedGameFlowWrapperMethods = [
    'startGame', 'selectFirstPlayer', 'keepCards', 'getChatLogs', 'getChatLog'
];

var customMatchers = {
    toHavePrompt: function() {
        return {
            compare: function(actual, expected) {
                var result = {};
                var currentPrompt = actual.currentPrompt();
                result.pass = actual.hasPrompt(expected);

                if(result.pass) {
                    result.message = `Expected ${actual.name} not to have prompt "${expected}" but it did.`;
                } else {
                    result.message = `Expected ${actual.name} to have prompt "${expected}" but it had menuTitle "${currentPrompt.menuTitle}" and promptTitle "${currentPrompt.promptTitle}".`;
                }

                return result;
            }
        };
    },
    toHavePromptButton: function(util, customEqualityMatchers) {
        return {
            compare: function(actual, expected) {
                var buttons = actual.currentPrompt().buttons;
                var result = {};

                result.pass = _.any(buttons, button => util.equals(button.text, expected, customEqualityMatchers));

                if(result.pass) {
                    result.message = `Expected ${actual.name} not to have prompt button "${expected}" but it did.`;
                } else {
                    var buttonText = _.map(buttons, button => '[' + button.text + ']').join('\n');
                    result.message = `Expected ${actual.name} to have prompt button "${expected}" but it had buttons:\n${buttonText}`;
                }

                return result;
            }
        };
    },
    toBeAbleToSelect: function() {
        return {
            compare: function(player, card) {
                if(_.isString(card)) {
                    card = player.findCardByName(card);
                }
                let result = {};

                result.pass = player.currentActionTargets.includes(card);

                if(result.pass) {
                    result.message = `Expected ${card.name} not to be selectable by ${player.name} but it was.`;
                } else {
                    result.message = `Expected ${card.name} to be selectable by ${player.name} but it wasn't.`;
                }

                return result;
            }
        };
    }
};

beforeEach(function() {
    jasmine.addMatchers(customMatchers);
});

global.integration = function(definitions) {
    describe('integration', function() {
        beforeEach(function() {
            this.flow = new GameFlowWrapper();

            this.game = this.flow.game;
            this.player1Object = this.game.getPlayerByName('player1');
            this.player2Object = this.game.getPlayerByName('player2');
            this.player1 = this.flow.player1;
            this.player2 = this.flow.player2;

            _.each(ProxiedGameFlowWrapperMethods, method => {
                this[method] = (...args) => this.flow[method].apply(this.flow, args);
            });

            this.buildDeck = function(faction, cards) {
                return deckBuilder.buildDeck(faction, cards);
            };

            /**
             * Factory method. Creates a new simulation of a game.
             * @param {Object} [options = {}] - specifies the state of the game
             */
            this.setupTest = function(options = {}) {
                //Set defaults
                if(!options.player1) {
                    options.player1 = {};
                }
                if(!options.player2) {
                    options.player2 = {};
                }

                //Build decks
                this.player1.selectDeck(deckBuilder.customDeck(options.player1));
                this.player2.selectDeck(deckBuilder.customDeck(options.player2));

                this.startGame();
                //Setup phase
                this.selectFirstPlayer(this.player1);
                this.keepCards();

                if(options.player1.house) {
                    this.player1.clickPrompt(options.player1.house);
                }

                //Player stats
                this.player1.amber = options.player1.amber;
                this.player2.amber = options.player2.amber;
                this.player1.chains = options.player1.chains;
                this.player2.chains = options.player2.chains;
                //Field
                this.player1.inPlay = options.player1.inPlay;
                this.player2.inPlay = options.player2.inPlay;
                //Conflict deck related
                this.player1.hand = options.player1.hand;
                this.player2.hand = options.player2.hand;
                this.player1.discard = options.player1.discard;
                this.player2.discard = options.player2.discard;

                if(options.phase !== 'setup') {
                    this.game.checkGameState(true);
                }
            };
        });

        definitions();
    });
};
