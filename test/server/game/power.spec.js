/*global describe, it, beforeEach, expect, jasmine*/

const Game = require('../../../server/game/game.js');
const Player = require('../../../server/game/player.js');

describe('the Game', () => {
    var game = {};
    var winner = {};
    var loser = {};

    beforeEach(() => {
        var gameRepository = jasmine.createSpyObj('gameRepository', ['save']);
        game = new Game('1', 'Test Game', { gameRepository: gameRepository });
        winner = new Player('1', 'Player 1', true, game);
        loser = new Player('1', 'Player 1', true, game);

        game.initialise();
        winner.initialise();
        loser.initialise();

        game.playersAndSpectators[winner.id] = winner;
        game.playersAndSpectators[loser.id] = loser;
    });

    describe('the transferPower() function', () => {
        describe('when the loser has enough power', () => {
            it('should transfer the exact amount of power', () => {
                winner.faction.power = 1;
                loser.faction.power = 2;

                game.transferPower(winner, loser, 2);

                expect(winner.faction.power).toBe(3);
            });
        });

        describe('when the loser does not have enough power', () => {
            beforeEach(() => {
                winner.faction.power = 1;
                loser.faction.power = 2;
                game.transferPower(winner, loser, 3);
            });

            it('should increase the winner power by the losers total power', () => {
                expect(winner.faction.power).toBe(3);
            });

            it('should set the losers power to 0', () => {
                expect(loser.faction.power).toBe(0);
            });
        });
    });
});
