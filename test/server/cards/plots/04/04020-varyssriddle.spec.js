/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('Varys\'s Riddle', function() {
    integration(function() {
        beforeEach(function() {
            const deck1 = this.buildDeck('greyjoy', [
                'Varys\'s Riddle',
                'The Roseroad'
            ]);

            this.player1.selectDeck(deck1);
        });

        describe('when there are plot modifiers out', function() {
            beforeEach(function() {
                const deck2 = this.buildDeck('lannister', [
                    'Wildfire Assault'
                ]);

                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.player1.clickCard('The Roseroad', 'hand');
                this.completeSetup();
            });

            it('should not crash', function() {
                expect(() => {
                    this.player1.selectPlot('Varys\'s Riddle');
                    this.player2.selectPlot('Wildfire Assault');
                    this.selectFirstPlayer(this.player1);
                    this.selectPlotOrder(this.player1);
                }).not.toThrow();
            });
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

        describe('when played against Calm Over Westeros', function() {
            integration(function() {
                beforeEach(function() {
                    const deck = this.buildDeck('lannister', [
                        'Calm Over Westeros', 'Varys\'s Riddle',
                        'The Tickler'
                    ]);
                    this.player1.selectDeck(deck);
                    this.player2.selectDeck(deck);
                    this.startGame();
                    this.keepStartingHands();

                    this.player2.clickCard('The Tickler', 'hand');
                    this.completeSetup();

                    this.player1.selectPlot('Varys\'s Riddle');
                    this.player2.selectPlot('Calm Over Westeros');
                    this.selectFirstPlayer(this.player2);

                    this.selectPlotOrder(this.player1);

                    // Reduce Intrigue claim using Varys's Riddle
                    this.player1.clickPrompt('Intrigue');

                    // Reduce claim on Military this round.
                    this.player2.clickPrompt('Military');

                    this.completeMarshalPhase();

                    this.player2.clickPrompt('Intrigue');
                    this.player2.clickCard('The Tickler', 'play area');
                    this.player2.clickPrompt('Done');

                    this.skipActionWindow();

                    this.player1.clickPrompt('Done');

                    this.skipActionWindow();
                    this.skipActionWindow();

                    this.player2.clickPrompt('Apply Claim');
                });

                it('should reduce the claim', function() {
                    expect(this.player1Object.discardPile.size()).toBe(0);
                });
            });
        });


        describe('when played against something that reacts to plots being revealed', function() {
            beforeEach(function() {
                const deck2 = this.buildDeck('stark', [
                    'Trading with the Pentoshi',
                    'Old Nan'
                ]);

                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();
                this.player2.clickCard('Old Nan', 'hand');
                this.completeSetup();

                this.player1.selectPlot('Varys\'s Riddle');
                this.player2.selectPlot('Trading with the Pentoshi');

                expect(this.player2).toHavePromptButton('Old Nan');
                this.player2.clickPrompt('Pass');

                this.selectFirstPlayer(this.player1);
                this.selectPlotOrder(this.player1);
            });

            it('should not trigger plot reveal interrupts / reactions', function() {
                expect(this.player2).not.toHavePromptButton('Old Nan');
            });
        });
    });
});
