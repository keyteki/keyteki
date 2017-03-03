/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('The Tickler', function() {
    integration(function() {
        beforeEach(function() {
            const deck1 = this.buildDeck('lannister', [
                'Sneak Attack',
                'The Tickler'
            ]);
            const deck2 = this.buildDeck('lannister', [
                'Sneak Attack',
                'The Roseroad', 'The Roseroad'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();
            this.player1.clickCard('The Tickler', 'hand');
            this.player2.clickCard('The Roseroad', 'hand');
            this.completeSetup();
            this.player1.selectPlot('Sneak Attack');
            this.player2.selectPlot('Sneak Attack');
            this.selectFirstPlayer(this.player1);

            // Move remaining cards back to draw deck.
            this.player2Object.hand.each(card => {
                this.player2Object.moveCard(card, 'draw deck');
            });

            this.completeMarshalPhase();
            this.completeChallengesPhase();

            this.roseroad = this.player2.findCardByName('The Roseroad', 'play area');

            this.player1.clickMenu('The Tickler', 'Discard opponents top card');
        });

        it('should discard the top card of the opponents deck', function() {
            expect(this.player2Object.drawDeck.size()).toBe(0);
            expect(this.player2Object.discardPile.size()).toBe(1);
        });

        it('should allow the Tickler to discard a card of the same name in play', function() {
            this.player1.clickCard(this.roseroad);

            expect(this.player2Object.discardPile.size()).toBe(2);
            expect(this.roseroad.location).toBe('discard pile');
        });
    });
});
