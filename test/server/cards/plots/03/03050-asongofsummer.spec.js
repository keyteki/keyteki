/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('A Song of Summer', function() {
    integration(function() {
        beforeEach(function() {
            const deck = this.buildDeck('lannister', [
                'A Song of Summer', 'Winter Festival',
                'Ser Jaime Lannister (Core)'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.jaime = this.player1.findCardByName('Ser Jaime Lannister', 'hand');

            this.player1.clickCard(this.jaime);

            this.completeSetup();
        });

        describe('when played against a non-Winter card', function() {
            beforeEach(function() {
                this.player1.selectPlot('A Song of Summer');
                this.player2.selectPlot('A Song of Summer');
            });

            it('should increase strength of characters by 1', function() {
                expect(this.jaime.getStrength()).toBe(6);
            });
        });

        describe('when played against a Winter card', function() {
            beforeEach(function() {
                this.player1.selectPlot('A Song of Summer');
                this.player2.selectPlot('Winter Festival');
            });

            it('should not increase strength of characters', function() {
                expect(this.jaime.getStrength()).toBe(5);
            });
        });
    });
});
