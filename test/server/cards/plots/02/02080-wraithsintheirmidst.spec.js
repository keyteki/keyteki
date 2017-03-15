/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('WraithsInTheirMidst', function() {
    integration(function() {
        beforeEach(function() {
            const deck1 = this.buildDeck('greyjoy', [
                'Wraiths in Their Midst',
                'Alannys Greyjoy'
            ]);
            const deck2 = this.buildDeck('lannister', [
                '"The Rains of Castamere"',
                'A Noble Cause', 'A Feast for Crows', 'Filthy Accusations',
                'Tywin Lannister (Core)'
            ]);
            this.player = this.player1Object;
            this.opponent = this.player2Object;

            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();
            this.player1.clickCard('Alannys Greyjoy', 'hand');
            this.player2.clickCard('Tywin Lannister', 'hand');
            this.completeSetup();

            this.nobleCause = this.player2.findCardByName('A Noble Cause');
            this.feastForCrows = this.player2.findCardByName('A Feast for Crows');
            this.filthyAccusations = this.player2.findCardByName('Filthy Accusations');
        });

        describe('when played against a plot that would not be reduced below 2', function() {
            beforeEach(function() {
                this.player1.selectPlot('Wraiths in Their Midst');
                this.player2.selectPlot(this.nobleCause);
                this.selectFirstPlayer(this.player1);
            });

            it('should reduce the reserve by the full amount', function() {
                // Reduce 6 reserve by 2 from plot, 1 by Alannys
                expect(this.player2Object.getTotalReserve()).toBe(3);
            });
        });

        describe('when played against a plot that would be reduced below 2', function() {
            beforeEach(function() {
                this.player1.selectPlot('Wraiths in Their Midst');
                this.player2.selectPlot(this.feastForCrows);
                this.selectFirstPlayer(this.player1);
            });

            it('should reduce the reserve and cap at the 2 minimum', function() {
                // Reduce 4 reserve by 2 from plot, 1 by Alannys, min 2.
                expect(this.player2Object.getTotalReserve()).toBe(2);
            });
        });

        describe('when Rains brings out a new plot', function() {
            beforeEach(function() {
                this.player1.selectPlot('Wraiths in Their Midst');
                this.player2.selectPlot(this.feastForCrows);
                this.selectFirstPlayer(this.player2);

                this.completeMarshalPhase();

                this.unopposedChallenge(this.player2, 'intrigue', 'Tywin Lannister');

                expect(this.player2).toHavePrompt('Trigger "The Rains of Castamere"?');
                this.player2.clickPrompt('Yes');
                this.player2.clickPrompt('Filthy Accusations');
            });

            it('should reduce the new plot revealed', function() {
                // Reduce 6 by 2 from plot, 0 from Alannys since not first player
                expect(this.player2Object.getTotalReserve()).toBe(4);
            });
        });
    });
});
