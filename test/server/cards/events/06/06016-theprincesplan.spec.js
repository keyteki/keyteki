/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('The Prince\'s Plan', function() {
    integration(function() {
        beforeEach(function() {
            const deck = this.buildDeck('martell', [
                'A Noble Cause',
                'The Prince\'s Plan', 'Obara Sand', 'The Red Viper (Core)'
            ]);

            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.player1.clickCard('Obara Sand', 'hand');
            this.player2.clickCard('The Red Viper', 'hand');

            this.completeSetup();
            this.player1.selectPlot('A Noble Cause');
            this.player2.selectPlot('A Noble Cause');
            this.selectFirstPlayer(this.player1);

            this.skipActionWindow();

            this.completeMarshalPhase();

            this.event = this.player1.findCardByName('The Prince\'s Plan');
        });

        describe('when in the discard pile and a challenge is lost', function() {
            beforeEach(function() {
                this.player1Object.moveCard(this.event, 'discard pile');

                this.skipActionWindow();
                this.player1.clickPrompt('Military');
                this.player1.clickCard('Obara Sand', 'play area');
                this.player1.clickPrompt('Done');

                this.skipActionWindow();

                this.player2.clickCard('The Red Viper', 'play area');
                this.player2.clickPrompt('Done');

                this.skipActionWindow();
            });

            it('should prompt to return the event back to hand', function() {
                expect(this.player1).toHavePromptButton('The Prince\'s Plan');
            });

            it('should allow the event to be returned to hand for 1 gold', function() {
                this.player1.clickPrompt('The Prince\'s Plan');

                expect(this.event.location).toBe('hand');
                expect(this.player1Object.gold).toBe(4);
            });
        });
    });
});
