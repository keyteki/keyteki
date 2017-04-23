/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('Selyse Baratheon', function() {
    integration(function() {
        beforeEach(function() {
            const deck1 = this.buildDeck('baratheon', [
                'Sneak Attack',
                'Selyse Baratheon'
            ]);
            const deck2 = this.buildDeck('martell', [
                'Sneak Attack',
                'Nymeria Sand'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();
            this.player1.clickCard('Selyse Baratheon', 'hand');
            this.player2.clickCard('Nymeria Sand', 'hand');
            this.completeSetup();
            this.player1.selectPlot('Sneak Attack');
            this.player2.selectPlot('Sneak Attack');
            this.selectFirstPlayer(this.player1);

            this.skipActionWindow();

            this.completeMarshalPhase();

            this.selyse = this.player1.findCardByName('Selyse Baratheon', 'play area');
            this.player2.clickMenu('Nymeria Sand', 'Remove icon from opponent\'s character');
            this.player2.clickCard(this.selyse);
            this.player2.clickPrompt('Intrigue');

            expect(this.selyse.hasIcon('intrigue')).toBe(false);

            this.player1.clickMenu(this.selyse, 'Pay 1 gold to give an intrigue icon to a character');
            this.player1.clickCard(this.selyse);
        });

        it('should allow a stolen icon to be restored', function() {
            expect(this.selyse.hasIcon('intrigue')).toBe(true);
        });

        it('should cost 1 gold', function() {
            expect(this.player1Object.gold).toBe(4);
        });
    });
});
