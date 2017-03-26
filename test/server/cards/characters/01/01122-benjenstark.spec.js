/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('Benjen Stark', function() {
    integration(function() {
        beforeEach(function() {
            const deck1 = this.buildDeck('thenightswatch', [
                'A Feast for Crows',
                'Benjen Stark', 'Benjen Stark'
            ]);
            const deck2 = this.buildDeck('stark', [
                'A Feast for Crows',
                'Summer (Core)'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();
            this.player1.clickCard('Benjen Stark', 'hand');
            this.player2.clickCard('Summer', 'hand');
            this.completeSetup();
            this.player1.selectPlot('A Feast for Crows');
            this.player2.selectPlot('A Feast for Crows');
            this.selectFirstPlayer(this.player2);

            this.benjen = this.player1.findCardByName('Benjen Stark', 'play area');

            this.completeMarshalPhase();
        });

        describe('when Benjen is killed', function() {
            beforeEach(function() {
                this.unopposedChallenge(this.player2, 'military', 'Summer');
                this.player2.clickPrompt('Apply Claim');

                this.player1.clickCard(this.benjen);
            });

            it('should allow the player to put Benjen back in the deck', function() {
                expect(this.player1).toHavePrompt('Trigger Benjen Stark?');
                this.player1.clickPrompt('Yes');

                expect(this.benjen.location).toBe('draw deck');
            });

            it('should not prompt twice', function() {
                // Trigger for the one being killed.
                this.player1.clickPrompt('Yes');

                // Should not prompt again for any copies of Benjen in hand
                expect(this.player1).not.toHavePrompt('Trigger Benjen Stark?');
            });
        });
    });
});
