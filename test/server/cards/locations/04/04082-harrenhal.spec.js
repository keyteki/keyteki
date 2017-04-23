/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('Harrenhal (GoH)', function() {
    integration(function() {
        beforeEach(function() {
            const deck = this.buildDeck('stark', [
                'Sneak Attack',
                'Harrenhal (GoH)', 'Littlefinger'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.harrenhal = this.player1.findCardByName('Harrenhal', 'hand');

            this.player1.clickCard(this.harrenhal);
            this.completeSetup();

            this.player1.selectPlot('Sneak Attack');
            this.player2.selectPlot('Sneak Attack');
            this.selectFirstPlayer(this.player1);

            this.skipActionWindow();
        });

        describe('when a character is put into play', function() {
            beforeEach(function() {
                this.littlefinger = this.player2.findCardByName('Littlefinger', 'hand');
                this.player1.clickPrompt('Done');
                this.player2.clickCard(this.littlefinger);
            });

            it('should prompt to kill the character', function() {
                this.player1.clickPrompt('Harrenhal');

                expect(this.harrenhal.location).toBe('discard pile');
                expect(this.player1Object.faction.kneeled).toBe(true);
                expect(this.littlefinger.location).toBe('dead pile');
            });

            it('should not prompt to trigger the ability of the character that was killed', function() {
                this.player1.clickPrompt('Harrenhal');

                expect(this.player2).not.toHavePromptButton('Littlefinger');
            });
        });
    });
});
