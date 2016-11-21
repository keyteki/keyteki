/*global describe, it, beforeEach, expect*/

const Game = require('../../../server/game/game.js');
const Player = require('../../../server/game/player.js');

describe('the Game', () => {
    var game = {};
    var winner = new Player('1', 'Player 1', true);
    var loser = new Player('1', 'Player 1', true);

    beforeEach(() => {
        game = new Game('1', 'Test Game');

        game.initialise();
        winner.initialise();
        loser.initialise();

        game.players[winner.id] = winner;
        game.players[loser.id] = loser;
    });

    describe('the transferPower() function', () => {
        describe('when the loser has enough power', () => {
            it('should transfer the exact amount of power', () => {
                winner.power = 1;
                loser.power = 2;

                game.transferPower(winner, loser, 2);

                expect(winner.power).toBe(3);
            });
        });

        describe('when the loser does not have enough power', () => {
            beforeEach(() => {
                winner.power = 1;
                loser.power = 2;
                game.transferPower(winner, loser, 3);
            });

            it('should increase the winner power by the losers total power', () => {
                expect(winner.power).toBe(3);
            });

            it('should set the losers power to 0', () => {
                expect(loser.power).toBe(0);
            });
        });
    });
});
