/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('Summoned to Court', function() {
    integration(function() {
        beforeEach(function() {
            const deck = this.buildDeck('greyjoy', [
                'Summoned to Court', 'A Noble Cause',
                'Aeron Damphair (Core)', 'Balon Greyjoy (Core)', 'The Roseroad'
            ]);

            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.skipSetupPhase();
        });

        describe('when one player chooses a character card with lower cost', function() {
            beforeEach(function() {
                this.player1.selectPlot('Summoned to Court');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player2);

                this.skipActionWindow();

                this.player2.clickCard('Aeron Damphair', 'hand');
                this.player1.clickCard('Balon Greyjoy', 'hand');
            });

            it('should prompt only that player to put it into play', function() {
                expect(this.player2).toHavePrompt('Put Aeron Damphair into play?');

                this.player2.clickPrompt('Yes');

                expect(this.player2.findCardByName('Aeron Damphair').location).toBe('play area');

                expect(this.player1).not.toHavePrompt('Put Balon Greyjoy into play?');
            });
        });

        describe('when both players choose a character card with the same cost', function() {
            beforeEach(function() {
                this.player1.selectPlot('Summoned to Court');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player2);

                this.skipActionWindow();

                this.player2.clickCard('Balon Greyjoy', 'hand');
                this.player1.clickCard('Balon Greyjoy', 'hand');
            });

            it('should prompt both players to put it into play', function() {
                expect(this.player2).toHavePrompt('Put Balon Greyjoy into play?');
                this.player2.clickPrompt('Yes');
                expect(this.player2.findCardByName('Balon Greyjoy').location).toBe('play area');

                expect(this.player1).toHavePrompt('Put Balon Greyjoy into play?');
                this.player1.clickPrompt('Yes');
                expect(this.player1.findCardByName('Balon Greyjoy').location).toBe('play area');
            });
        });

        describe('when one player chooses a character and another a non-character', function() {
            beforeEach(function() {
                this.player1.selectPlot('Summoned to Court');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player2);

                this.skipActionWindow();

                this.player2.clickCard('The Roseroad', 'hand');
                this.player1.clickCard('Balon Greyjoy', 'hand');
            });

            it('should only prompt the player that revealed a character', function() {
                expect(this.player1).toHavePrompt('Put Balon Greyjoy into play?');
                this.player1.clickPrompt('Yes');
                expect(this.player1.findCardByName('Balon Greyjoy').location).toBe('play area');
            });
        });

        describe('when one player does not have any cards', function() {
            beforeEach(function() {
                this.player2Object.hand.each(card => {
                    this.player2Object.moveCard(card, 'discard pile');
                });

                this.player1.selectPlot('Summoned to Court');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player2);

                this.skipActionWindow();
            });

            it('should only prompt the player with cards', function() {
                expect(this.player1).toHavePrompt('Choose a card to reveal');
                expect(this.player2).not.toHavePrompt('Choose a card to reveal');

                this.player1.clickCard('Balon Greyjoy', 'hand');

                expect(this.player1).toHavePrompt('Put Balon Greyjoy into play?');
                this.player1.clickPrompt('Yes');
                expect(this.player1.findCardByName('Balon Greyjoy').location).toBe('play area');
            });
        });

        describe('when neither player has cards', function() {
            beforeEach(function() {
                this.player1Object.hand.each(card => {
                    this.player1Object.moveCard(card, 'discard pile');
                });
                this.player2Object.hand.each(card => {
                    this.player2Object.moveCard(card, 'discard pile');
                });

                this.player1.selectPlot('Summoned to Court');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player2);

                this.skipActionWindow();
            });

            it('should not prompt either player', function() {
                expect(this.player1).not.toHavePrompt('Choose a card to reveal');
                expect(this.player2).not.toHavePrompt('Choose a card to reveal');
            });
        });
    });
});
