/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('Heads on Spikes', function() {
    integration(function() {
        beforeEach(function() {
            const deck1 = this.buildDeck('lannister', [
                'Heads on Spikes',
                'Cersei Lannister (LoCR)'
            ]);
            const deck2 = this.buildDeck('lannister', [
                'Sneak Attack',
                'Hedge Knight', 'Hedge Knight', 'The Roseroad', 'The Roseroad'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();
            this.completeSetup();
        });

        describe('when a character gets discarded', function() {
            beforeEach(function() {
                // Move non-characters back to draw
                this.player2Object.hand.each(card => {
                    if(card.getType() !== 'character') {
                        this.player2Object.moveCard(card, 'draw deck');
                    }
                });

                this.player1.selectPlot('Heads on Spikes');
                this.player2.selectPlot('Sneak Attack');
                this.selectFirstPlayer(this.player1);

                this.skipActionWindow();
            });

            it('should discard a card from the opponent hand', function() {
                // 1 card discarded, 2 drawn from draw phase
                expect(this.player2Object.hand.size()).toBe(3);
            });

            it('should move the opponent character into the dead pile', function() {
                expect(this.player2Object.discardPile.size()).toBe(0);
                expect(this.player2Object.deadPile.size()).toBe(1);
            });

            it('should gain 2 power for the current player', function() {
                expect(this.player1Object.faction.power).toBe(2);
            });
        });

        describe('when a non-character gets discarded', function() {
            beforeEach(function() {
                // Move characters back to draw
                this.player2Object.hand.each(card => {
                    if(card.getType() === 'character') {
                        this.player2Object.moveCard(card, 'draw deck');
                    }
                });

                this.player1.selectPlot('Heads on Spikes');
                this.player2.selectPlot('Sneak Attack');
                this.selectFirstPlayer(this.player1);

                this.skipActionWindow();
            });

            it('should discard a card from the opponent hand', function() {
                // 1 card discarded, 2 drawn from draw phase
                expect(this.player2Object.hand.size()).toBe(3);
            });

            it('should move the opponent character into the discard pile', function() {
                expect(this.player2Object.discardPile.size()).toBe(1);
                expect(this.player2Object.deadPile.size()).toBe(0);
            });

            it('should not gain power for the current player', function() {
                expect(this.player1Object.faction.power).toBe(0);
            });
        });
    });
});
