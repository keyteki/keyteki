/*global describe, it, beforeEach, spyOn, expect*/

const Game = require('../../server/game/game.js');
const Player = require('../../server/game/player.js');

describe('the Game', () => {
    var game = {};
    var player = new Player('1', 'Player 1', true);
    var testPlot = { card: { income: 5 } };
    var income = (card) => {
        return card.income;
    };

    beforeEach(() => {
        game = new Game('1', 'Test Game');

        game.initialise();

        game.players[player.id] = player;

        player.initialise();
        player.activePlot = testPlot;
        // Normal card w/out income
        player.cardsInPlay.push({ card: { }, attachments: [] });
    });

    describe('the getTotalPlotStat() function', () => {
        describe('when property is only provided by plot', () => {
            it('should equal the plot value', () => {
                expect(player.getTotalPlotStat(income)).toBe(5);
            });
        });

        describe('when a property modifying card is in play', () => {
            beforeEach(() => {
                player.cardsInPlay.push({ card: { income: 1 }, attachments: [] });
            });

            it('should include both the plot value and the modifier', () => {
                expect(player.getTotalPlotStat(income)).toBe(6);
            });
        });

        describe('when a property modifying attachment is in play', () => {
            beforeEach(() => {
                player.cardsInPlay.push({ card: {}, attachments: [{ income: 1 }] });
            });

            it('should include both the plot value and the modifier', () => {
                expect(player.getTotalPlotStat(income)).toBe(6);
            });
        });
    });
});
