/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('Wildling Bandit', function() {
    integration(function() {
        beforeEach(function() {
            const deck1 = this.buildDeck('lannister', [
                'Sneak Attack',
                'Wildling Bandit'
            ]);
            const deck2 = this.buildDeck('lannister', [
                'Time of Plenty'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.bandit = this.player1.findCardByName('Wildling Bandit');
            this.player1.clickCard(this.bandit);
            this.completeSetup();

            this.player1.selectPlot('Sneak Attack');
            this.player2.selectPlot('Time of Plenty');
            this.selectFirstPlayer(this.player1);

            this.skipActionWindow();

            this.completeMarshalPhase();
        });

        describe('when attacking a more wealthy opponent', function() {
            beforeEach(function() {
                this.skipActionWindow();

                this.player1.clickPrompt('Military');
                this.player1.clickCard(this.bandit);
                this.player1.clickPrompt('Done');
            });

            it('should increase the strength of Wildling Bandit by 2', function() {
                expect(this.player1Object.gold).toBe(5);
                expect(this.player2Object.gold).toBe(6);
                expect(this.bandit.getStrength()).toBe(3);
            });
        });
    });
});
