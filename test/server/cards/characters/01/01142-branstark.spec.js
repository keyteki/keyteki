/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('Bran Stark', function() {
    integration(function() {
        beforeEach(function() {
            const deck1 = this.buildDeck('stark', [
                'Sneak Attack',
                'Bran Stark',
                'Lady'
            ]);
            const deck2 = this.buildDeck('baratheon', [
                'A Feast for Crows',
                'Melisandre (Core)',
                'Seen In Flames'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();
            this.player1.clickCard('Bran Stark', 'hand');
            this.player2.clickCard('Melisandre (Core)', 'hand');
            this.completeSetup();
            this.player1.selectPlot('Sneak Attack');
            this.player2.selectPlot('A Feast for Crows');
            this.selectFirstPlayer(this.player2);

            this.bran = this.player1.findCardByName('Bran Stark', 'play area');
            this.seenInFlames = this.player2.findCardByName('Seen In Flames', 'hand');

            this.completeMarshalPhase();
        });

        describe('when an event is played', function() {
            beforeEach(function() {
                this.player2.clickCard('Seen In Flames', 'hand');
            });

            it('should cancel the event', function() {
                this.player1.clickPrompt('Bran Stark');

                expect(this.player2).toHavePromptButton('Melisandre');
            });

            it('should sacrifice bran', function() {
                this.player1.clickPrompt('Bran Stark');
                
                expect(this.bran.location).toBe('discard pile');
            });

            it('should still discard the event', function() {
                this.player1.clickPrompt('Bran Stark');
                
                expect(this.seenInFlames.location).toBe('discard pile');                
            });
        });
    });
});
