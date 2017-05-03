/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('Take the Black', function() {
    integration(function() {
        beforeEach(function() {
            const deck = this.buildDeck('thenightswatch', [
                'Trading with the Pentoshi',
                'Take the Black', 'Dothraki Outriders', 'Maester Aemon (Core)', 'Wildling Horde'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.player1.togglePromptedActionWindow('dominance', true);

            this.tooExpensive = this.player2.findCardByName('Dothraki Outriders', 'hand');
            this.unique = this.player2.findCardByName('Maester Aemon', 'hand');
            this.eligible = this.player2.findCardByName('Wildling Horde', 'hand');

            this.player2.clickCard(this.tooExpensive);
            this.completeSetup();
            this.player1.selectPlot('Trading with the Pentoshi');
            this.player2.selectPlot('Trading with the Pentoshi');
            this.selectFirstPlayer(this.player1);
            this.selectPlotOrder(this.player1);

            this.player1.clickPrompt('Done');
            this.player2.clickCard(this.unique);
            this.player2.clickCard(this.eligible);
            this.player2.clickPrompt('Done');

            this.completeChallengesPhase();

            this.player1.clickCard('Take the Black', 'hand');
        });

        it('should allow take control of non-unique, 6-gold-or-less characters', function() {
            this.player1.clickCard(this.eligible);

            expect(this.eligible.controller.name).toBe(this.player1Object.name);
        });

        it('should not allow take control of unique characters', function() {
            this.player1.clickCard(this.unique);

            expect(this.unique.controller).not.toBe(this.player1Object);
        });

        it('should not allow take control of more expensive than 6 gold characters', function() {
            this.player1.clickCard(this.tooExpensive);

            expect(this.tooExpensive.controller).not.toBe(this.player1Object);
        });
    });
});
