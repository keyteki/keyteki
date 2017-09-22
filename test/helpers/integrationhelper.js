/* global describe, beforeEach, jasmine */
/* eslint camelcase: 0, no-invalid-this: 0 */

const _ = require('underscore');

require('./objectformatters.js');

const DeckBuilder = require('./deckbuilder.js');
const GameFlowWrapper = require('./gameflowwrapper.js');

const ProxiedGameFlowWrapperMethods = [
    'startGame', 'keepStartingHands', 'skipSetupPhase', 'selectFirstPlayer',
    'completeSetup', 'skipActionWindow', 'selectProvinces'
];

const deckBuilder = new DeckBuilder();

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
        });

        definitions();
    });
};
