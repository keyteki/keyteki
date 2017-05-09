/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('Jaqen H\'ghar', function() {
    integration(function() {
        beforeEach(function() {
            const deck = this.buildDeck('lannister', [
                'Trading with the Pentoshi',
                'Jaqen H\'ghar', 'The Tickler', 'Arya Stark (Core)'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.jaqen = this.player1.findCardByName('Jaqen H\'ghar', 'hand');
            this.tickler = this.player2.findCardByName('The Tickler', 'hand');
            this.arya = this.player2.findCardByName('Arya Stark', 'hand');

            this.player2.clickCard(this.tickler);
            this.player2.clickCard(this.arya);
            this.completeSetup();

            this.player1.selectPlot('Trading with the Pentoshi');
            this.player2.selectPlot('Trading with the Pentoshi');
            this.selectFirstPlayer(this.player1);
            this.selectPlotOrder(this.player1);

            this.player1.clickCard(this.jaqen);
        });

        describe('when Jaqen enters play', function() {
            it('should allow placement of Valar Morghulis tokens', function() {
                this.player1.clickPrompt('Jaqen H\'ghar');
                this.player1.clickCard(this.tickler);
                this.player1.clickPrompt('Done');

                expect(this.tickler.hasToken('valarmorghulis')).toBe(true);
            });
        });

        describe('when Jaqen leaves play', function() {
            beforeEach(function() {
                this.player1.clickPrompt('Jaqen H\'ghar');
                this.player1.clickCard(this.tickler);
                this.player1.clickPrompt('Done');

                this.player1.dragCard(this.jaqen, 'discard pile');
            });

            it('should remove all Valar Morghulis tokens', function() {
                expect(this.tickler.hasToken('valarmorghulis')).toBe(false);
            });
        });

        describe('when Jaqen wins a challenge while attacking alone', function() {
            beforeEach(function() {
                this.player1.clickPrompt('Jaqen H\'ghar');
                this.player1.clickCard(this.tickler);
                this.player1.clickPrompt('Done');

                this.completeMarshalPhase();

                this.player1.clickPrompt('Intrigue');
                this.player1.clickCard(this.jaqen);
                this.player1.clickPrompt('Done');

                this.skipActionWindow();

                this.player2.clickPrompt('Done');

                this.skipActionWindow();
            });

            it('should allow him to kill a character with a Valar Morghulis token', function() {
                this.player1.clickPrompt('Jaqen H\'ghar');
                this.player1.clickCard(this.tickler);

                expect(this.tickler.location).toBe('dead pile');
            });

            it('should not allow him to kill a character without a Valar Morghulis token', function() {
                this.player1.clickPrompt('Jaqen H\'ghar');
                this.player1.clickCard(this.arya);

                expect(this.arya.location).toBe('play area');
            });
        });
    });
});
