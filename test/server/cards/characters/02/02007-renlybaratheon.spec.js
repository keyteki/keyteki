/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('Renly Baratheon (TtB)', function() {
    integration(function() {
        beforeEach(function() {
            const deck = this.buildDeck('baratheon', [
                'Sneak Attack',
                'Renly Baratheon (TtB)', 'Dragonstone Faithful', 'Castle Black', 'Steward at the Wall', 'Steward at the Wall'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.player1.clickCard('Renly Baratheon', 'hand');
            this.completeSetup();
            this.player1.selectPlot('Sneak Attack');
            this.player2.selectPlot('Sneak Attack');
            this.selectFirstPlayer(this.player1);
        });

        it('should reduce the first non Baratheon character marshalled.', function() {
            // Does not reduce Baratheon characters
            this.player1.clickCard('Dragonstone Faithful', 'hand');
            expect(this.player1Object.gold).toBe(4);

            // Does not reduce non-characters.
            this.player1.clickCard('Castle Black', 'hand');
            expect(this.player1Object.gold).toBe(2);

            // First non-Baratheon character, should be reduced.
            this.player1.clickCard('Steward at the Wall', 'hand');
            expect(this.player1Object.gold).toBe(2);

            // Does not reduce subsequent non-Baratheon characters.
            this.player1.clickCard('Steward at the Wall', 'hand');
            expect(this.player1Object.gold).toBe(1);
        });
    });
});
