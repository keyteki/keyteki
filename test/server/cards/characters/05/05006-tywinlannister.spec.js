/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('Tywin Lannister (LoCR)', function() {
    integration(function() {
        beforeEach(function() {
            const deck1 = this.buildDeck('lannister', [
                'Sneak Attack',
                'Tywin Lannister (LoCR)', 'Cersei Lannister (Core)', 'Hedge Knight'
            ]);
            const deck2 = this.buildDeck('lannister', [
                'Sneak Attack',
                'The Tickler', 'The Reader', 'Cersei Lannister (Core)', 'Hedge Knight'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.player1.clickCard('Tywin Lannister', 'hand');
            this.player2.clickCard('The Tickler', 'hand');
            this.player2.clickCard('The Reader', 'hand');
            this.completeSetup();
            this.player1.selectPlot('Sneak Attack');
            this.player2.selectPlot('Sneak Attack');
            this.selectFirstPlayer(this.player1);

            this.skipActionWindow();

            // Move remaining cards back to draw deck so we have something to discard
            this.player1Object.hand.each(card => this.player1Object.moveCard(card, 'draw deck'));
            this.player2Object.hand.each(card => this.player2Object.moveCard(card, 'draw deck'));
        });

        describe('when a single card discard occurs', function() {
            beforeEach(function() {
                this.cersei = this.player1.findCardByName('Cersei Lannister');
                this.knight = this.player1.findCardByName('Hedge Knight');

                this.completeMarshalPhase();
                this.completeChallengesPhase();
                this.player2.clickMenu('The Tickler', 'Discard opponents top card');
            });

            it('should allow Tywin to choose to trigger', function() {
                this.player1.clickPrompt('Tywin Lannister');
                this.player1.clickPrompt('Hedge Knight');
                expect(this.cersei.location).toBe('draw deck');
                expect(this.knight.location).toBe('discard pile');
            });
        });

        describe('when a multiple card discard occurs', function() {
            beforeEach(function() {
                this.cersei = this.player1.findCardByName('Cersei Lannister');
                this.knight = this.player1.findCardByName('Hedge Knight');

                this.completeMarshalPhase();

                // Pre-challenge action window
                this.skipActionWindow();

                // Challenge prompt for Player 1
                this.player1.clickPrompt('Done');

                // Challenge prompt for Player 2
                this.player2.clickPrompt('Power');
                this.player2.clickCard('The Reader', 'play area');
                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                // Player 1 does not oppose
                this.player1.clickPrompt('Done');

                this.skipActionWindow();

                // Trigger The Reader
                this.player2.clickPrompt('The Reader - Discard 3 cards');
            });

            it('should not allow Tywin to choose to trigger', function() {
                expect(this.player1).not.toHavePromptButton('Tywin Lannister');
            });
        });

        describe('when pillage occurs', function() {
            beforeEach(function() {
                this.cersei = this.player2.findCardByName('Cersei Lannister');
                this.knight = this.player2.findCardByName('Hedge Knight');

                this.completeMarshalPhase();

                // Pre-challenge action window
                this.skipActionWindow();

                // Challenge prompt for Player 1
                this.player1.clickPrompt('Power');
                this.player1.clickCard('Tywin Lannister', 'play area');
                this.player1.clickPrompt('Done');

                this.skipActionWindow();

                // Player 2 does not oppose
                this.player2.clickPrompt('Done');

                this.skipActionWindow();
                this.skipActionWindow();

                this.player1.clickPrompt('Apply Claim');
            });

            it('should allow Tywin to choose to trigger', function() {
                this.player1.clickPrompt('Tywin Lannister');
                this.player1.clickPrompt('Hedge Knight');
                expect(this.cersei.location).toBe('draw deck');
                expect(this.knight.location).toBe('discard pile');
            });
        });
    });
});
