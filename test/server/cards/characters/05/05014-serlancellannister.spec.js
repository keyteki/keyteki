/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('Ser Lancel Lannister', function() {
    integration(function() {
        beforeEach(function() {
            const deck = this.buildDeck('lannister', [
                'Trading with the Pentoshi',
                'Ser Lancel Lannister', 'Joffrey Baratheon (Core)', 'Ser Gregor Clegane', 'I Never Bet Against My Family'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.lancel = this.player1.findCardByName('Ser Lancel Lannister', 'hand');

            this.player1.clickCard(this.lancel);
            this.completeSetup();

            this.player1.selectPlot('Trading with the Pentoshi');
            this.player2.selectPlot('Trading with the Pentoshi');
            this.selectFirstPlayer(this.player1);
            this.selectPlotOrder(this.player1);

            this.skipActionWindow();
        });

        describe('when there are no lords or ladies out', function() {
            it('should have strength 0', function() {
                expect(this.lancel.getStrength()).toBe(0);
            });
        });

        describe('when exactly one other lord or lady is out', function() {
            beforeEach(function() {
                this.player1.clickCard('Ser Gregor Clegane', 'hand');
            });

            it('should have strength equal to that lord or lady', function() {
                expect(this.lancel.getStrength()).toBe(10);
            });
        });

        describe('when more than one other lord or lady is out', function() {
            beforeEach(function() {
                this.player1.clickCard('Ser Gregor Clegane', 'hand');
                this.player1.clickCard('Joffrey Baratheon', 'hand');
            });

            it('should have strength equal to that lord or lady', function() {
                expect(this.lancel.getStrength()).toBe(0);
            });
        });

        describe('when a card leaves play via an effect', function() {
            beforeEach(function() {
                this.gregor = this.player1.findCardByName('Ser Gregor Clegane', 'hand');
                this.gregor.controller.moveCard(this.gregor, 'draw deck');
                this.player1.clickCard('Joffrey Baratheon', 'hand');

                this.completeMarshalPhase();

                this.player1.clickCard('I Never Bet Against My Family', 'hand');
                this.player1.clickPrompt('Ser Gregor Clegane');
            });

            it('should not crash', function() {
                expect(this.gregor.location).toBe('play area');
                expect(this.lancel.getStrength()).toBe(0);

                // Skip pre-challenge action window.
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
                this.player1.clickPrompt('Done');

                // No challenges from either player
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');

                expect(this.gregor.location).toBe('discard pile');
                expect(this.lancel.getStrength()).toBe(3);
            });
        });
    });
});
