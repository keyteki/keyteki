/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('Dolorous Edd', function() {
    integration(function() {
        beforeEach(function() {
            const deck1 = this.buildDeck('thenightswatch', [
                'Sneak Attack',
                'Dolorous Edd'
            ]);
            const deck2 = this.buildDeck('lannister', [
                'Sneak Attack',
                'Grand Maester Pycelle', 'Ser Jaime Lannister (LoCR)'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.player2.clickCard('Grand Maester Pycelle', 'hand');
            this.player2.clickCard('Ser Jaime Lannister', 'hand');
            this.completeSetup();
            this.player1.selectPlot('Sneak Attack');
            this.player2.selectPlot('Sneak Attack');
            this.selectFirstPlayer(this.player2);

            this.completeMarshalPhase();

            this.edd = this.player1.findCardByName('Dolorous Edd', 'hand');

            this.player2.clickPrompt('Intrigue');
        });

        it('should allow Dolorous Edd to jump in to the challenge', function() {
            this.player2.clickCard('Grand Maester Pycelle', 'play area');
            this.player2.clickPrompt('Done');

            // Skip player 2's action window
            this.player2.clickPrompt('Done');

            this.player1.clickCard('Dolorous Edd', 'hand');

            expect(this.edd.location).toBe('play area');
            expect(this.edd.kneeled).toBe(true);
            expect(this.player1Object.faction.kneeled).toBe(true);
        });

        describe('when the player wins the challenge Edd enters', function() {
            beforeEach(function() {
                this.player2.clickCard('Grand Maester Pycelle', 'play area');
                this.player2.clickPrompt('Done');

                // Skip player 2's action window
                this.player2.clickPrompt('Done');

                this.player1.clickCard('Dolorous Edd', 'hand');

                // Complete player 1's action window
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
                this.player1.clickPrompt('Done');

                // Do not explicitly defend
                expect(this.player1).toHavePrompt('Select defenders');
                this.player1.clickPrompt('Done');

                this.skipActionWindow();
            });

            it('should prompt the player to return Edd to hand', function() {
                expect(this.player1).toHavePrompt('Return Dolorous Edd to your hand?');
            });

            it('should allow the player to return Edd to hand', function() {
                this.player1.clickPrompt('Yes');
                expect(this.edd.location).toBe('hand');
            });

            it('should allow the player to decline to return Edd to hand', function() {
                this.player1.clickPrompt('No');
                expect(this.edd.location).toBe('play area');
            });
        });

        describe('when the player does not win the challenge Edd enters', function() {
            beforeEach(function() {
                this.player2.clickCard('Ser Jaime Lannister', 'play area');
                this.player2.clickPrompt('Done');

                // Skip player 2's action window
                this.player2.clickPrompt('Done');

                this.player1.clickCard('Dolorous Edd', 'hand');

                // Complete player 1's action window
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
                this.player1.clickPrompt('Done');

                // Do not explicitly defend
                expect(this.player1).toHavePrompt('Select defenders');
                this.player1.clickPrompt('Done');

                this.skipActionWindow();
            });

            it('should not prompt the player to return Edd to hand', function() {
                expect(this.player1).not.toHavePrompt('Return Dolorous Edd to hand?');
            });
        });
    });
});
