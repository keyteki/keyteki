/*global describe, it, beforeEach, spyOn, expect*/

const Game = require('../../server/game/game.js');
const Player = require('../../server/game/player.js');

describe('the Game', () => {
    var game = {};
    var player = new Player('1', 'Player 1', true);
    var testPlot = { card: { income: 5 } };

    beforeEach(() => {
        game = new Game('1', 'Test Game');

        game.initialise();

        game.players[player.id] = player;

        player.initialise();
        player.activePlot = testPlot;
        // Normal card w/out income
        player.cardsInPlay.push({ card: { }, attachments: [] });
    });

    describe('the getTotalIncome() function', () => {
        describe('when income is only provided by plot', () => {
            it('should equal the plot income value', () => {
                expect(player.getTotalIncome()).toBe(5);
            });
        });

        describe('when an income modifying card is in play', () => {
            beforeEach(() => {
                player.cardsInPlay.push({ card: { income: 1 }, attachments: [] });
            });

            it('should include both the plot income and the modifier', () => {
                expect(player.getTotalIncome()).toBe(6);
            });
        });

        describe('when an income modifying attachment is in play', () => {
            beforeEach(() => {
                player.cardsInPlay.push({ card: {}, attachments: [{ income: 1 }] });
            });

            it('should include both the plot income and the modifier', () => {
                expect(player.getTotalIncome()).toBe(6);
            });
        });
    });
});
