/* global describe, it, expect, beforeEach, jasmine */

const _ = require('underscore');

const Game = require('../../../../../server/game/game.js');
const Player = require('../../../../../server/game/player.js');
const cards = require('../../../../../server/game/cards');

describe('Trading With The Pentoshi', () => {
    var game = new Game('1', 'Test Game');
    var player1 = new Player('1', 'Player 1', true, game);
    var player2 = new Player('2', 'Player 2', false, game);
    var pentoshi = new cards['02039'](player1, {text: 'When Revealed: something something 3 gold'});
    var pentoshi2 = new cards['02039'](player2, {text: 'When Revealed: something something 3 gold'});
    var testPlot = jasmine.createSpyObj('testplot', ['hasRevealEffect', 'flipFaceup', 'getInitiative', 'onReveal']);

    beforeEach(() => {
        pentoshi.uuid = '1';
        testPlot.uuid = '2';

        testPlot.onReveal.and.returnValue(true);

        player1.plotCards = _([testPlot, pentoshi]);
        player2.plotCards = _([testPlot, pentoshi2]);

        player1.gold = 0;
        player2.gold = 0;

        game.players['1'] = player1;
        game.players['2'] = player2;

        game.initialise();
    });

    describe('When a player has trading revealed and that player is first player', () => {
        it('should give the other player 3 gold', () => {
            game.selectPlot(player1.id, pentoshi.uuid);
            game.selectPlot(player2.id, testPlot.uuid);

            game.setFirstPlayer(player1.id, 'me');

            expect(player2.gold).toBe(3);
            expect(player1.gold).toBe(0);
        });
    });

    describe('When a player has trading revealed and the other player is first player', () => {
        it('should give the other player 3 gold', () => {
            game.selectPlot(player1.id, pentoshi.uuid);
            game.selectPlot(player2.id, testPlot.uuid);

            game.setFirstPlayer(player1.id, 'other');

            expect(player2.gold).toBe(3);
            expect(player1.gold).toBe(0);
        });
    });

    describe('When both players have trading revealed and that player is first player', () => {
        it('should give both players 3 gold', () => {
            game.selectPlot(player1.id, pentoshi.uuid);
            game.selectPlot(player2.id, pentoshi2.uuid);

            game.setFirstPlayer(player1.id, 'me');
            game.resolvePlayerPlotEffect(player1.id);

            expect(player2.gold).toBe(3);
            expect(player1.gold).toBe(3);
        });
    });
});
