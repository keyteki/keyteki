/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('forced reaction order', function() {
    integration(function() {
        beforeEach(function() {
            const deck1 = this.buildDeck('lannister', [
                'Trading with the Pentoshi',
                'The Hound', 'The Hound'
            ]);
            const deck2 = this.buildDeck('thenightswatch', [
                'Trading with the Pentoshi',
                'The Wall', 'Will'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();
            this.player1.clickCard('The Hound', 'hand');
            this.player2.clickCard('The Wall', 'hand');
            this.player2.clickCard('Will', 'hand');
            this.completeSetup();

            this.player1.selectPlot('Trading with the Pentoshi');
            this.player2.selectPlot('Trading with the Pentoshi');
            this.selectFirstPlayer(this.player1);

            // Resolve plot order
            this.player1.clickPrompt('player1');

            this.completeMarshalPhase();

            this.skipActionWindow();
            this.player1.clickPrompt('Power');
            this.player1.clickCard('The Hound', 'play area');
            this.player1.clickPrompt('Done');
            this.skipActionWindow();
            this.player2.clickPrompt('Done');
            this.skipActionWindow();
        });

        it('should prompt the first player', function() {
            expect(this.player1).toHavePromptButton('player1 - The Hound');
            expect(this.player1).toHavePromptButton('player2 - The Wall');
            expect(this.player1).toHavePromptButton('player2 - Will');
        });

        it('should allow the abilities to be triggered', function() {
            let hound = this.player1.findCardByName('The Hound', 'play area');
            let wall = this.player2.findCardByName('The Wall', 'play area');
            let will = this.player2.findCardByName('Will', 'play area');

            expect(hound.location).toBe('play area');
            expect(will.location).toBe('play area');
            expect(wall.kneeled).toBe(false);

            this.player1.clickPrompt('player2 - Will');
            this.player2.clickCard(will);

            expect(hound.location).toBe('play area');
            expect(will.location).toBe('discard pile');
            expect(wall.kneeled).toBe(false);

            this.player1.clickPrompt('player2 - The Wall');

            expect(hound.location).toBe('play area');
            expect(will.location).toBe('discard pile');
            expect(wall.kneeled).toBe(true);

            expect(this.player1).toHavePrompt('Discard 1 card at random for The Hound?');

            this.player1.clickPrompt('No');

            expect(hound.location).toBe('hand');
            expect(will.location).toBe('discard pile');
            expect(wall.kneeled).toBe(true);
        });
    });
});
