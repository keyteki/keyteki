/*global describe, it, beforeEach, spyOn, expect*/

const Game = require('../../server/game/game.js');
const Player = require('../../server/game/player.js');
const Spectator = require('../../server/game/spectator.js');

describe('the Game', () => {
    var game = {};
    var player1 = new Player('1', 'Player 1', true);
    var spectator = new Spectator('3', 'Spectator 1');

    beforeEach(() => {
        game = new Game('1', 'Test Game');

        game.initialise();

        game.players[player1.id] = player1;
        game.players[spectator.id] = spectator;

        spyOn(player1, 'mulligan');
    });

    describe('the mulligan() function', () => {
        describe('when called for a player not in the game', () => {
            it('should not mulligan for any players', () => {
                game.mulligan('notinthegame');

                expect(player1.mulligan).not.toHaveBeenCalled();
                expect(game.messages.length).toBe(0);
            });
        });

        describe('when called for a player in the game which has not started', () => {
            it('should mulligan for that player', () => {
                game.mulligan(player1.id);

                expect(player1.mulligan).toHaveBeenCalled();
                expect(game.messages.length).toBe(0);
            });
        });

        describe('when called for a for a player in the game which has started', () => {
            it('should not mulligan for any players', () => {
                game.playStarted = true;
                game.mulligan(player1.id);

                expect(player1.mulligan).not.toHaveBeenCalled();
                expect(game.messages.length).toBe(0);
            });
        });
    });
});
