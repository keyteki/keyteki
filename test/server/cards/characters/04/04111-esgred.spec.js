/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('Esgred', function() {
    integration(function() {
        beforeEach(function() {
            const deck1 = this.buildDeck('greyjoy', [
                'Trading with the Pentoshi',
                'Esgred', 'Asha Greyjoy'
            ]);
            const deck2 = this.buildDeck('lannister', [
                'Trading with the Pentoshi',
                'Hedge Knight', 'Hedge Knight'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.asha = this.player1.findCardByName('Asha Greyjoy', 'hand');
            this.esgred = this.player1.findCardByName('Esgred', 'hand');
            [this.knight1, this.knight2] = this.player2.filterCardsByName('Hedge Knight', 'hand');

            this.player2.clickCard(this.knight1);
            this.player2.clickCard(this.knight2);
            this.completeSetup();

            this.player1.selectPlot('Trading with the Pentoshi');
            this.player2.selectPlot('Trading with the Pentoshi');
            this.selectFirstPlayer(this.player1);
            this.selectPlotOrder(this.player1);

            this.skipActionWindow();
        });

        describe('when declaring Esgred as an attacker', function() {
            beforeEach(function() {
                this.player1.clickCard(this.esgred);
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                this.player1.clickPrompt('Military');
                this.player1.clickCard(this.esgred);
                this.player1.clickPrompt('Done');
            });

            it('should allow 2 characters to be bypassed by stealth', function() {
                expect(this.player1).toHavePrompt('Select up to 2 stealth targets for Esgred');
                this.player1.clickCard(this.knight1);
                this.player1.clickCard(this.knight2);
                this.player1.clickPrompt('Done');

                expect(this.knight1.stealth).toBe(true);
                expect(this.knight2.stealth).toBe(true);
            });
        });

        describe('when Esgred is in play and Asha enters play', function() {
            beforeEach(function() {
                this.player1.clickCard(this.esgred);
                this.player1.clickCard(this.asha);
            });

            it('should have Asha gain power', function() {
                expect(this.asha.power).toBe(1);
            });

            it('should sacrifice Esgred', function() {
                expect(this.esgred.location).toBe('discard pile');
            });
        });

        describe('when Asha is in play and Esgred enters play', function() {
            beforeEach(function() {
                this.player1.clickCard(this.asha);
                this.player1.clickCard(this.esgred);
            });

            it('should have Asha gain power', function() {
                expect(this.asha.power).toBe(1);
            });

            it('should sacrifice Esgred', function() {
                expect(this.esgred.location).toBe('discard pile');
            });
        });
    });
});
