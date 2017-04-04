/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('challenges phase', function() {
    integration(function() {
        describe('when a side has higher strength but no participating characters', function() {
            beforeEach(function() {
                const deck = this.buildDeck('thenightswatch', [
                    'Sneak Attack',
                    'Steward at the Wall', 'The Haunted Forest', 'The Haunted Forest', 'The Shadow Tower'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();
                this.player1.clickCard('Steward at the Wall', 'hand');
                this.player2.clickCard('The Haunted Forest', 'hand');
                this.player2.clickCard('The Haunted Forest', 'hand');
                this.player2.clickCard('The Shadow Tower', 'hand');
                this.completeSetup();

                this.player1.selectPlot('Sneak Attack');
                this.player2.selectPlot('Sneak Attack');
                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();

                this.skipActionWindow();

                this.player1.clickPrompt('Intrigue');
                this.player1.clickCard('Steward at the Wall', 'play area');
                this.player1.clickPrompt('Done');

                // Skip attackers declared window
                this.skipActionWindow();

                this.player2.clickPrompt('Done');

                // Skip defenders declared window
                this.skipActionWindow();
            });

            it('should not trigger any win reactions for the defender', function() {
                expect(this.player2).not.toHavePromptButton('The Shadow Tower');
            });

            it('should complete the challenge', function() {
                expect(this.player1).toHavePromptButton('Military');
                expect(this.player1).toHavePromptButton('Intrigue');
                expect(this.player1).toHavePromptButton('Power');
            });
        });
    });
});
