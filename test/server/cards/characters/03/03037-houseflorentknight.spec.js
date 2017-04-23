/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('House Florent Knight', function() {
    integration(function() {
        beforeEach(function() {
            const deck = this.buildDeck('tyrell', [
                'Trading with the Pentoshi',
                'House Florent Knight', 'Hedge Knight'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();
            this.completeSetup();
            this.player1.selectPlot('Trading with the Pentoshi');
            this.player2.selectPlot('Trading with the Pentoshi');

            this.florentKnight = this.player2.findCardByName('House Florent Knight', 'hand');
        });

        describe('when there is a lower strength character out', function() {
            beforeEach(function() {
                this.selectFirstPlayer(this.player1);
                this.selectPlotOrder(this.player1);

                this.skipActionWindow();

                this.hedgeKnight = this.player1.findCardByName('Hedge Knight', 'hand');

                this.player1.clickCard(this.hedgeKnight);
                this.player1.clickPrompt('Done');

                this.player2.clickCard(this.florentKnight);
            });

            it('should allow that character to be discarded', function() {
                this.player2.clickCard(this.hedgeKnight);

                expect(this.hedgeKnight.location).toBe('discard pile');
            });
        });

        describe('when House Florent Knight would be the lowest strength', function() {
            beforeEach(function() {
                this.selectFirstPlayer(this.player2);
                this.selectPlotOrder(this.player2);

                this.skipActionWindow();

                this.player2.clickCard(this.florentKnight);
            });

            it('should require HFK to be discarded', function() {
                this.player2.clickCard(this.florentKnight);
                expect(this.florentKnight.location).toBe('discard pile');
            });
        });
    });
});
