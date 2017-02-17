/* global describe, it, expect, beforeEach, jasmine */
/* eslint camelcase: 0, no-invalid-this: 0, quotes: 0 */

const _ = require('underscore');

const SummerHarvest = require('../../../../../server/game/cards/plots/04/summerharvest.js');

describe('SummerHarvest', function() {
    describe('integration', function() {
        const Game = require('../../../../../server/game/game.js');
        const PlotCard = require('../../../../../server/game/plotcard.js');

        beforeEach(function() {
            this.gameRepository = jasmine.createSpyObj('gameRepository', ['save']);
            this.game = new Game(null, {}, { gameRepository: this.gameRepository });
            this.game.join('1', { username: 'foo' });
            this.game.join('2', { username: 'bar' });

            this.player = this.game.getPlayerByName('foo');
            this.opponent = this.game.getPlayerByName('bar');

            this.game.initialise();

            var summerHarvestCardData = { "pack_code" : "CtA", "pack_name" : "Called to Arms", "type_code" : "plot", "type_name" : "Plot", "faction_code" : "neutral", "faction_name" : "Neutral", "position" : 39, "code" : "04039", "name" : "Summer Harvest", "cost" : null, "text" : "<b>When Revealed:</b> Choose an opponent. X is 2 higher than the printed gold value on that player's revealed plot card.", "quantity" : 3, "income" : 0, "initiative" : 4, "claim" : 1, "reserve" : 6, "deck_limit" : 2, "strength" : null, "traits" : "Summer.", "flavor" : null, "illustrator" : "Tomasz Jedruszek", "is_unique" : false, "is_loyal" : false, "is_military" : false, "is_intrigue" : false, "is_power" : false, "octgn_id" : "9804cffd-3269-4860-8285-135446dd3dba", "url" : "https://thronesdb.com/card/04039", "imagesrc" : "/bundles/cards/04039.png", "label" : "Summer Harvest", "ci" : null, "si" : 4 };
            this.summerHarvest = new SummerHarvest(this.player, summerHarvestCardData);
            this.player.plotDeck = _([this.summerHarvest]);

            var nobleCauseCardData = { "pack_code" : "Core", "pack_name" : "Core Set", "type_code" : "plot", "type_name" : "Plot", "faction_code" : "neutral", "faction_name" : "Neutral", "position" : 4, "code" : "01004", "name" : "A Noble Cause", "cost" : null, "text" : "Reduce the cost of the first <i>Lord</i> or <i>Lady</i> character you marshal this round by 2.", "quantity" : 1, "income" : 5, "initiative" : 0, "claim" : 1, "reserve" : 6, "deck_limit" : 2, "strength" : null, "traits" : "Kingdom. Noble.", "flavor" : null, "illustrator" : "Drazenka Kimpel", "is_unique" : false, "is_loyal" : false, "is_military" : false, "is_intrigue" : false, "is_power" : false, "octgn_id" : "0fb3ad4b-5cf3-49e9-a33f-484ecafeabf8", "url" : "https://thronesdb.com/card/01004", "imagesrc" : "/bundles/cards/01004.png", "label" : "A Noble Cause", "ci" : 5, "si" : null };
            this.nobleCause = new PlotCard(this.opponent, nobleCauseCardData);
            this.opponent.plotDeck = _([this.nobleCause]);

            this.player.keep();
            this.opponent.keep();
            this.player.startGame();
            this.opponent.startGame();
        });

        describe('when played against a normal plot', function() {
            beforeEach(function() {
                this.game.currentPhase = 'plot';
                this.player.phase = 'plot';
                this.opponent.phase = 'plot';
                this.player.startPlotPhase();
                this.opponent.startPlotPhase();
                this.player.selectedPlot = this.summerHarvest;
                this.opponent.selectedPlot = this.nobleCause;
                this.player.flipPlotFaceup();
                this.opponent.flipPlotFaceup();
                // Resolve events in pipeline.
                this.game.continue();
                this.game.raiseEvent('onPlotRevealed', this.player);
                // Resolve events in pipeline.
                this.game.continue();
            });

            it('should calculate the gold amount properly', function() {
                expect(this.summerHarvest.getIncome()).toBe(7);
            });

            describe('when playing it again after going through all plots', function() {
                beforeEach(function() {
                    this.game.currentPhase = 'plot';
                    this.player.phase = 'plot';
                    this.opponent.phase = 'plot';
                    this.player.startPlotPhase();
                    this.opponent.startPlotPhase();
                    this.player.selectedPlot = this.summerHarvest;
                    this.opponent.selectedPlot = this.nobleCause;
                    this.player.flipPlotFaceup();
                    this.opponent.flipPlotFaceup();
                    // Resolve events in pipeline.
                    this.game.continue();
                    this.game.raiseEvent('onPlotRevealed', this.player);
                    // Resolve events in pipeline.
                    this.game.continue();
                });

                it('should still properly calculate the gold amount properly', function() {
                    expect(this.summerHarvest.getIncome()).toBe(7);
                });
            });
        });

        describe('when played against Varys\'s Riddle', function() {
            const VaryssRiddle = require('../../../../../server/game/cards/plots/04/varyssriddle.js');

            beforeEach(function() {
                var varysRiddleCardData = { "pack_code" : "AtSK", "pack_name" : "Across the Seven Kingdoms", "type_code" : "plot", "type_name" : "Plot", "faction_code" : "neutral", "faction_name" : "Neutral", "position" : 20, "code" : "04020", "name" : "Varys's Riddle", "cost" : null, "text" : "<b>When Revealed:</b> Initiate the when revealed ability on a revealed non-<i>Riddle</i> plot card as if you had just revealed it.", "quantity" : 3, "income" : 5, "initiative" : 6, "claim" : 1, "reserve" : 7, "deck_limit" : 2, "strength" : null, "traits" : "Riddle. Scheme.", "flavor" : "\"In a room sit three great men, a king, a priest, and a rich man with his gold. Between them stands a sellsword, a little man of common birth and no great mind. Each of the great ones bids him slay the other two.\" <cite>Varys</cite>", "illustrator" : "Serena Malyon", "is_unique" : false, "is_loyal" : false, "is_military" : false, "is_intrigue" : false, "is_power" : false, "octgn_id" : "d68d7083-089d-4d28-8249-e70613639680", "url" : "https://thronesdb.com/card/04020", "imagesrc" : "/bundles/cards/04020.png", "label" : "Varys's Riddle", "ci" : 5, "si" : 6 };
                this.varysRiddle = new VaryssRiddle(this.opponent, varysRiddleCardData);
                this.opponent.plotDeck = _([this.varysRiddle]);

                this.game.currentPhase = 'plot';
                this.player.phase = 'plot';
                this.opponent.phase = 'plot';
                this.player.startPlotPhase();
                this.opponent.startPlotPhase();
                this.player.selectedPlot = this.summerHarvest;
                this.opponent.selectedPlot = this.varysRiddle;
                this.player.flipPlotFaceup();
                this.opponent.flipPlotFaceup();
                // Resolve events in pipeline.
                this.game.continue();

                // Opponent is first player, chooses to resolve Summer Harvest first.
                this.game.raiseEvent('onPlotRevealed', this.player);
                // Resolve events in pipeline.
                this.game.continue();

                // Resolves Varys' Riddle, which will overwrite the Summer Harvest value.
                // See this thread for details: http://www.cardgamedb.com/forums/index.php?/topic/32255-varys-riddle-vs-summer-harvest/?p=281948
                this.game.raiseEvent('onPlotRevealed', this.opponent);
                // Resolve events in pipeline.
                this.game.continue();
            });

            it('should use the second value for Summer Harvest', function() {
                expect(this.summerHarvest.getIncome()).toBe(2);
            });
        });
    });
});
