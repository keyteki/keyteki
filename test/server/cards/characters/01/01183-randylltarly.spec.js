/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('Randyll Tarly', function() {
    integration(function() {
        beforeEach(function() {
            const deck1 = this.buildDeck('tyrell', [
                'A Feast for Crows', 'A Song of Summer',
                'Randyll Tarly', 'Margaery Tyrell (Core)'
            ]);
            const deck2 = this.buildDeck('stark', [
                'A Feast for Crows',
                'Dracarys!', 'Rhaegal'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();
            this.player1.clickCard('Randyll Tarly', 'hand');
            this.player2.clickCard('Rhaegal', 'hand');
            this.completeSetup();

            this.randyll = this.player1.findCardByName('Randyll Tarly', 'play area');
        });

        describe('when strength is increased by a character ability', function() {
            beforeEach(function() {
                // Kneel Randyll manually
                this.player1.clickCard(this.randyll);

                this.player1.selectPlot('A Feast for Crows');
                this.player2.selectPlot('A Feast for Crows');
                this.selectFirstPlayer(this.player1);

                this.skipActionWindow();

                let margaery = this.player1.findCardByName('Margaery Tyrell', 'hand');

                this.player1.clickCard(margaery);

                this.completeMarshalPhase();

                // Activate Margaery's ability
                this.player1.clickMenu(margaery, 'Kneel this character to give another +3 STR');
                this.player1.clickCard(this.randyll);

                this.player1.clickPrompt('Randyll Tarly');
            });

            it('should stand Randyll', function() {
                expect(this.randyll.kneeled).toBe(false);
                expect(this.randyll.getStrength()).toBe(8);
            });
        });

        describe('when strength is increased by a plot', function() {
            beforeEach(function() {
                // Kneel Randyll manually
                this.player1.clickCard(this.randyll);

                this.player1.selectPlot('A Song of Summer');
                this.player2.selectPlot('A Feast for Crows');

                // A Song of Summer takes effect immediately
                this.player1.clickPrompt('Randyll Tarly');
            });

            it('should stand Randyll', function() {
                expect(this.randyll.kneeled).toBe(false);
                expect(this.randyll.getStrength()).toBe(6);
            });
        });

        describe('when strength is decreased', function() {
            beforeEach(function() {
                this.player1.selectPlot('A Feast for Crows');
                this.player2.selectPlot('A Feast for Crows');
                this.selectFirstPlayer(this.player1);

                this.skipActionWindow();

                this.completeMarshalPhase();

                this.skipActionWindow();

                // Declare challenge with Randyll.
                this.player1.clickPrompt('Power');
                this.player1.clickCard(this.randyll);
                this.player1.clickPrompt('Done');

                // Pass action window
                this.player1.clickPrompt('Done');

                // Activate Dracarys
                this.player2.clickCard('Dracarys!', 'hand');
                this.player2.clickCard('Rhaegal', 'play area');

                // Target Randyll
                this.player2.clickCard(this.randyll);

                // Complete action window
                this.player2.clickPrompt('Done');
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');

                // No defenders
                this.player2.clickPrompt('Done');

                // Skip post defense action window
                this.skipActionWindow();

                // Skip post winner window
                this.skipActionWindow();

                this.player1.clickPrompt('Apply Claim');
            });

            it('should not stand Randyll', function() {
                expect(this.player1).not.toHavePromptButton('Randyll Tarly');
                expect(this.randyll.kneeled).toBe(true);
                expect(this.randyll.getStrength()).toBe(1);
            });

            it('should not stand Randyll when the decrease effect ends', function() {
                // Finish challenges to end the phase.
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');

                expect(this.player1).not.toHavePromptButton('Randyll Tarly');
                expect(this.randyll.kneeled).toBe(true);
                expect(this.randyll.getStrength()).toBe(5);
            });
        });
    });
});
