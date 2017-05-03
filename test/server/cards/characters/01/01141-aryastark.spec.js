/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('Arya Stark (Core)', function() {
    integration(function() {
        beforeEach(function() {
            const deck = this.buildDeck('stark', [
                'Trading with the Pentoshi',
                'Arya Stark (Core)', 'Arya Stark (Core)', 'Hedge Knight', 'Night Gathers...'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();
            this.completeSetup();
            this.player1.selectPlot('Trading with the Pentoshi');
            this.player2.selectPlot('Trading with the Pentoshi');
            this.selectFirstPlayer(this.player1);
            this.selectPlotOrder(this.player1);

            [this.arya1, this.arya2] = this.player1.filterCardsByName('Arya Stark', 'hand');
            this.cardInDeck = this.player1.findCardByName('Hedge Knight', 'hand');
            this.player1Object.moveCard(this.cardInDeck, 'draw deck');
        });

        describe('when Arya enters play', function() {
            beforeEach(function() {
                this.player1.clickCard(this.arya1);
            });

            describe('when triggering her ability', function() {
                beforeEach(function() {
                    this.player1.clickPrompt('Arya Stark');
                });

                it('should use the facedown top of deck card as a dupe', function() {
                    expect(this.arya1.dupes).toContain(this.cardInDeck);
                    expect(this.cardInDeck.facedown).toBe(true);
                });

                it('should give a military icon', function() {
                    expect(this.arya1.hasIcon('military')).toBe(true);
                });
            });

            describe('when a dupe is played directly', function() {
                beforeEach(function() {
                    this.player1.clickPrompt('Pass');
                    this.player1.clickCard(this.arya2);
                });

                it('should give a military icon', function() {
                    expect(this.arya1.hasIcon('military')).toBe(true);
                });
            });
        });

        describe('vs Night Gathers', function() {
            beforeEach(function() {
                this.player1Object.moveCard(this.arya1, 'discard pile');

                // Complete marshalling
                this.player1.clickPrompt('Done');

                this.player2.clickCard('Night Gathers...', 'hand');
                this.player2.clickCard(this.arya1);
            });

            it('should not trigger her ability because she cannot be duped', function() {
                expect(this.player2).not.toHavePromptButton('Arya Stark');
            });
        });
    });
});
