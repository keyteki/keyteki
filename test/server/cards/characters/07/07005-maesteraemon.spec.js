/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('Maester Aemon (WotW)', function() {
    integration(function() {
        beforeEach(function() {
            const deck = this.buildDeck('thenightswatch', [
                'Sneak Attack',
                'Maester Aemon (WotW)', 'The Seastone Chair', 'Steward at the Wall'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.intrigueCharacter = this.player2.findCardByName('Steward at the Wall', 'hand');

            this.player1.clickCard('Maester Aemon', 'hand');
            this.player1.clickCard('The Seastone Chair', 'hand');
            this.player2.clickCard(this.intrigueCharacter);

            this.completeSetup();

            this.player1.selectPlot('Sneak Attack');
            this.player2.selectPlot('Sneak Attack');
            this.selectFirstPlayer(this.player2);

            this.completeMarshalPhase();

            this.unopposedChallenge(this.player2, 'Intrigue', this.intrigueCharacter);

            this.player2.clickPrompt('Apply Claim');
            this.player2.clickPrompt('Done');
            this.player1.clickPrompt('Done');
        });

        describe('when the challenge phase ends', function() {
            beforeEach(function() {
                this.player1.clickPrompt('Maester Aemon');
            });

            it('should prompt to apply claim for challenges not initiated against the player', function() {
                expect(this.player1).toHavePromptButton('Military');
                expect(this.player1).toHavePromptButton('Power');
                expect(this.player1).not.toHavePromptButton('Intrigue');
            });

            it('should allow claim of their choice to be applied', function() {
                this.player1.clickPrompt('Military');

                expect(this.player2).toHavePrompt('Select 2 characters to fulfill military claim');

                this.player2.clickCard(this.intrigueCharacter);
                this.player2.clickPrompt('Done');

                expect(this.intrigueCharacter.location).toBe('dead pile');
            });

            it('should not trigger cards that react to claim being applied for / during a challenge', function() {
                this.player1.clickPrompt('Military');
                expect(this.player1).not.toHavePromptButton('The Seastone Chair');
            });
        });
    });
});
