/* global describe, beforeEach */
/* eslint camelcase: 0, no-invalid-this: 0 */

const _ = require('underscore');

const GameFlowWrapper = require('./gameflowwrapper.js');

const ProxiedGameFlowWrapperMethods = [
    'startGame', 'keepStartingHands', 'skipSetupPhase', 'selectFirstPlayer',
    'completeMarshalPhase', 'completeChallengesPhase', 'completeDominancePhase',
    'completeTaxationPhase', 'selectPlotOrder', 'completeSetup'
];

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
        });

        definitions();
    });
};
