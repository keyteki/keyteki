/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('The Haunted Forest', function() {
    integration(function() {
        beforeEach(function() {
            const deck = this.buildDeck('thenightswatch', [
                'Sneak Attack',
                'The Haunted Forest', 'The Haunted Forest', 'Steward at the Wall', 'Maester Aemon (Core)'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            [this.forest1, this.forest2] = this.player1.filterCardsByName('The Haunted Forest', 'hand');

            this.player1.clickCard(this.forest1);
            this.player1.clickCard(this.forest2);
            this.player2.clickCard('Steward at the Wall', 'hand');
            this.player2.clickCard('Maester Aemon', 'hand');
            this.completeSetup();

            this.player1.selectPlot('Sneak Attack');
            this.player2.selectPlot('Sneak Attack');
            this.selectFirstPlayer(this.player2);

            this.completeMarshalPhase();
        });

        describe('when a challenge can be won by the strength provided', function() {
            beforeEach(function() {
                this.player2.clickPrompt('Intrigue');
                this.player2.clickCard('Steward at the Wall', 'play area');
                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                this.player1.clickPrompt('Done');
            });

            it('should provide strength', function() {
                expect(this.game.currentChallenge.attackerStrength).toBe(1);
                expect(this.game.currentChallenge.defenderStrength).toBe(2);
            });

            it('should win the challenge', function() {
                this.skipActionWindow();

                expect(this.player2).not.toHavePrompt('Apply Claim');
            });
        });

        describe('when a challenge is lost', function() {
            beforeEach(function() {
                this.player2.clickPrompt('Intrigue');
                this.player2.clickCard('Maester Aemon', 'play area');
                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                this.player1.clickPrompt('Done');

                this.skipActionWindow();

                this.player2.clickPrompt('player1 - The Haunted Forest');

                this.skipActionWindow();
            });

            it('should kneel the Haunted Forest', function() {
                expect(this.forest1.kneeled).toBe(true);
                expect(this.forest2.kneeled).toBe(true);
            });

            it('should not grant unopposed power', function() {
                expect(this.player2Object.getTotalPower()).toBe(0);
            });
        });
    });
});
