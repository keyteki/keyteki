/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('The Red Keep', function() {
    integration(function() {
        beforeEach(function() {
            const deck = this.buildDeck('stark', [
                'Trading with the Pentoshi',
                'The Red Keep', 'Areo Hotah', 'Maester Caleotte', 'Nightmares'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.redKeep = this.player1.findCardByName('The Red Keep', 'hand');
            this.character = this.player1.findCardByName('Maester Caleotte', 'hand');

            this.player1.clickCard(this.character);
            this.player1.clickCard(this.redKeep);
            this.completeSetup();

            this.player1.selectPlot('Trading with the Pentoshi');
            this.player2.selectPlot('Trading with the Pentoshi');
            this.selectFirstPlayer(this.player1);
            this.selectPlotOrder(this.player1);

            this.completeMarshalPhase();
        });

        describe('during a power challenge w/ at least one participating character', function() {
            beforeEach(function() {
                this.player1.clickPrompt('Power');
                this.player1.clickCard(this.character);
                this.player1.clickPrompt('Done');
            });

            it('should provide +2 strength', function() {
                // 2 from Caleotte, 2 from the Red Keep.
                expect(this.game.currentChallenge.attackerStrength).toBe(4);
            });

            it('should remove the strength bonus if blanked mid-challenge', function() {
                this.player1.clickPrompt('Done');
                this.player2.clickCard('Nightmares', 'hand');
                this.player2.clickCard(this.redKeep);

                expect(this.game.currentChallenge.attackerStrength).toBe(2);
            });

            it('should not keep the strength bonus if all characters removed from the challenge', function() {
                this.player1.clickPrompt('Done');
                this.player2.clickCard('Areo Hotah', 'hand');
                this.player2.clickPrompt('Areo Hotah');
                this.player2.clickCard(this.character);

                expect(this.game.currentChallenge.attackerStrength).toBe(0);
            });
        });
    });
});
