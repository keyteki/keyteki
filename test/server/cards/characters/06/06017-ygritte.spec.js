/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('Ygritte', function() {
    integration(function() {
        beforeEach(function() {
            const deck = this.buildDeck('baratheon', [
                'Sneak Attack',
                'Ygritte', 'Melisandre (Core)', 'Chataya\'s Brothel'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.ygritte = this.player1.findCardByName('Ygritte', 'hand');
            this.brothel = this.player1.findCardByName('Chataya\'s Brothel', 'hand');
            this.player1.clickCard(this.ygritte);
            this.player1.clickCard(this.brothel);
            this.completeSetup();

            this.player1.selectPlot('Sneak Attack');
            this.player2.selectPlot('Sneak Attack');
            this.selectFirstPlayer(this.player1);

            this.player1.clickPrompt('Done');
        });

        it('should not be knelt by card effects', function() {
            this.player2.clickCard('Melisandre', 'hand');
            this.player2.clickPrompt('Melisandre');

            this.player2.clickCard(this.ygritte);

            expect(this.ygritte.kneeled).toBe(false);
        });

        it('should be knelt by framework effects', function() {
            this.player2.clickPrompt('Done');

            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.ygritte);
            this.player1.clickPrompt('Done');

            expect(this.ygritte.kneeled).toBe(true);
        });

        it('should be knelt as a cost', function() {
            this.player1.clickMenu(this.brothel, 'Kneel a character to gain gold');
            this.player1.clickCard(this.ygritte);

            expect(this.player1Object.gold).toBe(6);
            expect(this.ygritte.kneeled).toBe(true);
        });

        it('should be knelt by player interaction', function() {
            this.player1.clickCard(this.ygritte);

            expect(this.ygritte.kneeled).toBe(true);
        });
    });
});
