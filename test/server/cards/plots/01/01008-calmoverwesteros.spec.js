/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('Calm Over Westeros', function() {
    integration(function() {
        beforeEach(function() {
            const deck = this.buildDeck('lannister', [
                'Calm Over Westeros', 'A Noble Cause',
                'The Tickler'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.player2.clickCard('The Tickler', 'hand');
            this.completeSetup();

            this.player1.selectPlot('Calm Over Westeros');
            this.player2.selectPlot('A Noble Cause');
            this.selectFirstPlayer(this.player2);

            // Reduce claim on Military this round.
            this.player1.clickPrompt('Military');

            this.completeMarshalPhase();
        });

        describe('when applying claim to the reduced challenge type', function() {
            beforeEach(function() {
                this.player2.clickPrompt('Military');
                this.player2.clickCard('The Tickler', 'play area');
                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                this.player1.clickPrompt('Done');

                this.skipActionWindow();
                this.skipActionWindow();

                this.player2.clickPrompt('Apply Claim');
            });

            it('should not apply that claim', function() {
                expect(this.player1).not.toHavePrompt('Select 1 character to fulfill military claim');
            });
        });

        describe('when applying claim to another challenge type', function() {
            beforeEach(function() {
                this.player2.clickPrompt('Intrigue');
                this.player2.clickCard('The Tickler', 'play area');
                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                this.player1.clickPrompt('Done');

                this.skipActionWindow();
                this.skipActionWindow();

                this.player2.clickPrompt('Apply Claim');
            });

            it('should apply that claim as normal', function() {
                expect(this.player1Object.discardPile.size()).toBe(1);
            });
        });
    });
});
