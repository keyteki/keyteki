/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('SummerHarvest', function() {
    integration(function() {
        beforeEach(function() {
            const deck1 = this.buildDeck('lannister', ['Summer Harvest', 'Tyrion Lannister (Core)']);
            const deck2 = this.buildDeck('lannister', ['A Noble Cause', 'Varys\'s Riddle']);
            this.player = this.player1Object;
            this.opponent = this.player2Object;

            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.skipSetupPhase();

            this.summerHarvest = this.player1.findCardByName('Summer Harvest');
            this.nobleCause = this.player2.findCardByName('A Noble Cause');
            this.varysRiddle = this.player2.findCardByName('Varys\'s Riddle');
        });

        describe('when played against a normal plot', function() {
            beforeEach(function() {
                this.player1.selectPlot(this.summerHarvest);
                this.player2.selectPlot(this.nobleCause);

                this.selectFirstPlayer(this.player1);

                this.skipActionWindow();
            });

            it('should calculate the gold amount properly', function() {
                expect(this.summerHarvest.getIncome()).toBe(7);
            });

            describe('when playing it again after going through all plots', function() {
                beforeEach(function() {
                    this.completeMarshalPhase();
                    this.completeChallengesPhase();
                    this.completeDominancePhase();
                    this.skipActionWindow();
                    this.completeTaxationPhase();

                    // Move Summer Harvest back to the plot deck so it's eligible to be picked again.
                    this.summerHarvest.controller.moveCard(this.summerHarvest, 'plot deck');

                    this.player1.selectPlot(this.summerHarvest);
                    this.player2.selectPlot(this.nobleCause);

                    this.selectFirstPlayer(this.player1);

                    this.skipActionWindow();
                });

                it('should still properly calculate the gold amount properly', function() {
                    expect(this.summerHarvest.getIncome()).toBe(7);
                });
            });
        });

        describe('when played against Varys\'s Riddle', function() {
            beforeEach(function() {
                this.player1.selectPlot(this.summerHarvest);
                this.player2.selectPlot(this.varysRiddle);

                this.selectFirstPlayer(this.player1);

                // Opponent is first player, chooses to resolve Summer Harvest
                // first, then Varys' Riddle, which will overwrite the Summer
                // Harvest value.
                // See this thread for details: http://www.cardgamedb.com/forums/index.php?/topic/32255-varys-riddle-vs-summer-harvest/?p=281948
                this.selectPlotOrder(this.player1);

                this.skipActionWindow();
            });

            it('should use the second value for Summer Harvest', function() {
                expect(this.summerHarvest.getIncome()).toBe(2);
            });
        });
    });
});
