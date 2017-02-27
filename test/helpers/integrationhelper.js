/* global describe, beforeEach */
/* eslint camelcase: 0, no-invalid-this: 0 */

const _ = require('underscore');

const DeckBuilder = require('./deckbuilder.js');
const GameFlowWrapper = require('./gameflowwrapper.js');

const ProxiedGameFlowWrapperMethods = [
    'startGame', 'keepStartingHands', 'skipSetupPhase', 'selectFirstPlayer',
    'completeMarshalPhase', 'completeChallengesPhase', 'completeDominancePhase',
    'completeTaxationPhase', 'selectPlotOrder', 'completeSetup'
];

const deckBuilder = new DeckBuilder();

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
