/* global describe, beforeEach, jasmine */
/* eslint camelcase: 0, no-invalid-this: 0 */

const _ = require('underscore');

require('./objectformatters.js');

const DeckBuilder = require('./deckbuilder.js');
const GameFlowWrapper = require('./gameflowwrapper.js');

const ProxiedGameFlowWrapperMethods = [
    'eachPlayerInFirstPlayerOrder', 'startGame', 'keepDynasty', 'keepConflict', 'skipSetupPhase', 'selectFirstPlayer',
    'noMoreActions', 'selectStrongholdProvinces', 'advancePhases'
];

var customMatchers = {
    toHavePrompt: function(util, customEqualityMatchers) {
        return {
            compare: function(actual, expected) {
                var currentTitle = actual.currentPrompt().menuTitle;
                var result = {};

                result.pass = util.equals(currentTitle, expected, customEqualityMatchers);

                if(result.pass) {
                    result.message = `Expected ${actual.name} not to have prompt "${expected}" but it did.`;
                } else {
                    result.message = `Expected ${actual.name} to have prompt "${expected}" but it had "${currentTitle}".`;
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
    toBeAbleToSelect: function(util, customEqualityMatchers) {
        return {
            compare: function(player, card) {
                if(_.isString(card)) {
                    card = player.findCardByName(card);
                }
                let result = {};

                result.pass = player.player.promptState.getCardSelectionState(card).selectable;

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
        beforeEach(function(done) {
            this.flow = new GameFlowWrapper();

            this.game = this.flow.game;
            this.player1Object = this.game.getPlayerByName('player1');
            this.player2Object = this.game.getPlayerByName('player2');
            this.player1 = this.flow.player1;
            this.player2 = this.flow.player2;

            _.each(ProxiedGameFlowWrapperMethods, method => {
                this[method] = (...args) => this.flow[method].apply(this.flow, args);
            });

            this.deckBuilder = new DeckBuilder();

            this.buildDeck = function(faction, cards) {
                return this.deckBuilder.buildDeck(faction, cards);
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
                this.player1.selectDeck(this.deckBuilder.customDeck(options.player1));
                this.player2.selectDeck(this.deckBuilder.customDeck(options.player2));

                this.startGame();
                //Setup phase
                this.selectFirstPlayer(this.player1);

                this.selectStrongholdProvinces({
                    player1: options.player1.strongholdProvince,
                    player2: options.player2.strongholdProvince
                });
                this.keepDynasty();
                this.keepConflict();

                //Advance the phases to the specified
                this.advancePhases(options.phase);

                //Set state
                this.player1.fate = options.player1.fate;
                this.player2.fate = options.player2.fate;
                this.player1.honor = options.player1.honor;
                this.player2.honor = options.player2.honor;
                this.player1.inPlay = options.player1.inPlay;
                this.player2.inPlay = options.player2.inPlay;
                this.player1.hand = options.player1.hand;
                this.player2.hand = options.player2.hand;
                this.player1.provinces = options.player1.provinces;
                this.player2.provinces = options.player2.provinces;
                this.player1.dynastyDiscardPile = options.player1.dynastyDiscard;
                this.player2.dynastyDiscardPile = options.player2.dynastyDiscard;
                this.player1.conflictDiscard = options.player1.conflictDiscard;
                this.player2.conflictDiscard = options.player2.conflictDiscard;
            };

            this.initiateConflict = function(options = {}) {
                if(!options.type) {
                    options.type = 'military';
                }
                if(!options.ring) {
                    options.ring = 'air';
                }
                let attackingPlayer = this.getPromptedPlayer('Choose an elemental ring\n(click the ring again to change conflict type)');
                if(!attackingPlayer) {
                    throw new Error('Neither player can declare a conflict');
                }
                attackingPlayer.declareConflict(options.type, options.province, options.attackers, options.ring);
                if(!options.defenders) {
                    return;
                }
                let defendingPlayer = this.getPromptedPlayer('Choose defenders');
                defendingPlayer.assignDefenders(options.defenders);
                if(!options.jumpTo) {
                    return;
                }
                this.noMoreActions();
            }

            this.deckBuilder.loadCards(done);
        });

        definitions();
    });
};
