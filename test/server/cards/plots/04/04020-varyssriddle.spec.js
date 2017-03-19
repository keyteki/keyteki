/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('Varys\'s Riddle', function() {
    integration(function() {
        beforeEach(function() {
            const deck1 = this.buildDeck('greyjoy', [
                'Varys\'s Riddle'
            ]);

            this.player1.selectDeck(deck1);
        });

        describe('when played against Wraiths in Their Midst', function() {
            beforeEach(function() {
                const deck2 = this.buildDeck('lannister', [
                    'Wraiths in Their Midst'
                ]);

                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();
                this.completeSetup();

                this.varysRiddle = this.player1.findCardByName('Varys\'s Riddle');

                this.player1.selectPlot('Varys\'s Riddle');
                this.player2.selectPlot('Wraiths in Their Midst');
                this.selectFirstPlayer(this.player1);
            });

            it('should reduce Varys\'s Riddle by the proper amount', function() {
                // Reduce 7 by 2 from Wraiths
                expect(this.varysRiddle.getReserve()).toBe(5);
            });
        });
    });
});
