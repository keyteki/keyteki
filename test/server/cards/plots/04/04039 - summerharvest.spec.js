/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0, quotes: 0 */

describe('SummerHarvest', function() {
    integration(function() {
        const summerHarvestCardData = { "pack_code" : "CtA", "pack_name" : "Called to Arms", "type_code" : "plot", "type_name" : "Plot", "faction_code" : "neutral", "faction_name" : "Neutral", "position" : 39, "code" : "04039", "name" : "Summer Harvest", "cost" : null, "text" : "<b>When Revealed:</b> Choose an opponent. X is 2 higher than the printed gold value on that player's revealed plot card.", "quantity" : 3, "income" : 0, "initiative" : 4, "claim" : 1, "reserve" : 6, "deck_limit" : 2, "strength" : null, "traits" : "Summer.", "flavor" : null, "illustrator" : "Tomasz Jedruszek", "is_unique" : false, "is_loyal" : false, "is_military" : false, "is_intrigue" : false, "is_power" : false, "octgn_id" : "9804cffd-3269-4860-8285-135446dd3dba", "url" : "https://thronesdb.com/card/04039", "imagesrc" : "/bundles/cards/04039.png", "label" : "Summer Harvest", "ci" : null, "si" : 4 };
        const nobleCauseCardData = { "pack_code" : "Core", "pack_name" : "Core Set", "type_code" : "plot", "type_name" : "Plot", "faction_code" : "neutral", "faction_name" : "Neutral", "position" : 4, "code" : "01004", "name" : "A Noble Cause", "cost" : null, "text" : "Reduce the cost of the first <i>Lord</i> or <i>Lady</i> character you marshal this round by 2.", "quantity" : 1, "income" : 5, "initiative" : 0, "claim" : 1, "reserve" : 6, "deck_limit" : 2, "strength" : null, "traits" : "Kingdom. Noble.", "flavor" : null, "illustrator" : "Drazenka Kimpel", "is_unique" : false, "is_loyal" : false, "is_military" : false, "is_intrigue" : false, "is_power" : false, "octgn_id" : "0fb3ad4b-5cf3-49e9-a33f-484ecafeabf8", "url" : "https://thronesdb.com/card/01004", "imagesrc" : "/bundles/cards/01004.png", "label" : "A Noble Cause", "ci" : 5, "si" : null };
        const varysRiddleCardData = { "pack_code" : "AtSK", "pack_name" : "Across the Seven Kingdoms", "type_code" : "plot", "type_name" : "Plot", "faction_code" : "neutral", "faction_name" : "Neutral", "position" : 20, "code" : "04020", "name" : "Varys's Riddle", "cost" : null, "text" : "<b>When Revealed:</b> Initiate the when revealed ability on a revealed non-<i>Riddle</i> plot card as if you had just revealed it.", "quantity" : 3, "income" : 5, "initiative" : 6, "claim" : 1, "reserve" : 7, "deck_limit" : 2, "strength" : null, "traits" : "Riddle. Scheme.", "flavor" : "\"In a room sit three great men, a king, a priest, and a rich man with his gold. Between them stands a sellsword, a little man of common birth and no great mind. Each of the great ones bids him slay the other two.\" <cite>Varys</cite>", "illustrator" : "Serena Malyon", "is_unique" : false, "is_loyal" : false, "is_military" : false, "is_intrigue" : false, "is_power" : false, "octgn_id" : "d68d7083-089d-4d28-8249-e70613639680", "url" : "https://thronesdb.com/card/04020", "imagesrc" : "/bundles/cards/04020.png", "label" : "Varys's Riddle", "ci" : 5, "si" : 6 };

        const deck1 = {
            faction: { value: 'lannister' },
            plotCards: [
                { count: 1, card: summerHarvestCardData }
            ],
            drawCards: []
        };
        const deck2 = {
            faction: { value: 'lannister' },
            plotCards: [
                { count: 1, card: nobleCauseCardData },
                { count: 1, card: varysRiddleCardData }
            ],
            drawCards: []
        };

        beforeEach(function() {
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
            });

            it('should calculate the gold amount properly', function() {
                expect(this.summerHarvest.getIncome()).toBe(7);
            });

            describe('when playing it again after going through all plots', function() {
                beforeEach(function() {
                    this.completeMarshalPhase();
                    this.completeChallengesPhase();
                    this.completeDominancePhase();
                    this.completeTaxationPhase();

                    // Move Summer Harvest back to the plot deck so it's eligible to be picked again.
                    this.summerHarvest.controller.moveCard(this.summerHarvest, 'plot deck');

                    this.player1.selectPlot(this.summerHarvest);
                    this.player2.selectPlot(this.nobleCause);

                    this.selectFirstPlayer(this.player1);
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
            });

            it('should use the second value for Summer Harvest', function() {
                expect(this.summerHarvest.getIncome()).toBe(2);
            });
        });
    });
});
