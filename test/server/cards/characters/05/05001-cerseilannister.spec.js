/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('Cersei Lannister (LoCR)', function() {
    integration(function() {
        beforeEach(function() {
            const deck1 = this.buildDeck('lannister', [
                'Sneak Attack', 'A Clash of Kings', 'Heads on Spikes',
                'Cersei Lannister (LoCR)'
            ]);
            const deck2 = this.buildDeck('lannister', [
                'Sneak Attack',
                'Hedge Knight', 'Hedge Knight'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.player1.clickCard('Cersei Lannister', 'hand');
            this.completeSetup();
        });

        describe('when opponent hand cards are discarded', function() {
            describe('when a single card is discarded via claim', function() {
                beforeEach(function() {
                    this.cersei = this.player1.findCardByName('Cersei Lannister');

                    this.player1.selectPlot('A Clash of Kings');
                    this.player2.selectPlot('Sneak Attack');
                    this.selectFirstPlayer(this.player1);

                    this.skipActionWindow();

                    this.completeMarshalPhase();

                    this.unopposedChallenge(this.player1, 'Intrigue', this.cersei);

                    this.player1.clickPrompt('Apply Claim');
                });

                it('should allow Cersei to gain power', function() {
                    this.player1.clickPrompt('Cersei Lannister');
                    expect(this.cersei.power).toBe(1);
                });
            });

            describe('when a multiple cards are discarded via claim', function() {
                beforeEach(function() {
                    this.cersei = this.player1.findCardByName('Cersei Lannister');

                    this.player1.selectPlot('Sneak Attack');
                    this.player2.selectPlot('Sneak Attack');
                    this.selectFirstPlayer(this.player1);

                    this.skipActionWindow();

                    this.completeMarshalPhase();

                    this.unopposedChallenge(this.player1, 'Intrigue', this.cersei);

                    this.player1.clickPrompt('Apply Claim');
                });

                it('should not prompt Cersei to gain power twice', function() {
                    this.player1.clickPrompt('Cersei Lannister');

                    expect(this.player1).not.toHavePromptButton('Cersei Lannister');
                });
            });

            describe('when a single card is discarded via other means', function() {
                beforeEach(function() {
                    this.cersei = this.player1.findCardByName('Cersei Lannister');

                    this.player1.selectPlot('Heads on Spikes');
                    this.player2.selectPlot('Sneak Attack');
                    this.selectFirstPlayer(this.player1);
                });

                it('should allow Cersei to gain power', function() {
                    this.player1.clickPrompt('Cersei Lannister');
                    expect(this.cersei.power).toBe(1);
                });
            });
        });
    });
});
