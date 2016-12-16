/*global describe, it, beforeEach, expect, spyOn*/

const DiscardToReservePrompt = require('../../../../server/game/gamesteps/taxation/discardtoreserveprompt.js');
const Game = require('../../../../server/game/game.js');
const Player = require('../../../../server/game/player.js');

describe('the DiscardToReservePrompt', () => {
    var prompt;
    var game = {};
    var player1;
    var player2;

    beforeEach(() => {
        game = new Game('1', 'Test Game');
        player1 = new Player('1', { username: 'Player 1' }, true, game);
        player2 = new Player('2', { username: 'Player 2' }, false, game);
        player1.firstPlayer = true;
        game.players[0] = player1;
        game.players[1] = player2;
        prompt = new DiscardToReservePrompt(game);
        spyOn(player1, 'isBelowReserve');
        spyOn(player2, 'isBelowReserve');
    });

    describe('the continue() function', () => {
        describe('when all players are below reserve', () => {
            beforeEach(() => {
                player1.isBelowReserve.and.returnValue(true);
                player2.isBelowReserve.and.returnValue(true);
            });

            it('should auto complete the prompt', () => {
                expect(prompt.continue()).toBe(true);
            });
        });
    });

    describe('the onMenuCommand() function', () => {
        beforeEach(() => {
            spyOn(prompt, 'completePlayer');
        });

        describe('when called by someone other than the current player', () => {
            it('should not complete the player', () => {
                prompt.onMenuCommand(player2, '');
                expect(prompt.completePlayer).not.toHaveBeenCalled();
            });
        });

        describe('when called by the current player', () => {
            describe('when the player is below reserve', () => {
                beforeEach(() => {
                    player1.isBelowReserve.and.returnValue(true);
                });

                it('should complete the player', () => {
                    prompt.onMenuCommand(player1, '');
                    expect(prompt.completePlayer).toHaveBeenCalled();
                });
            });

            describe('when the player is not below reserve', () => {
                beforeEach(() => {
                    player1.isBelowReserve.and.returnValue(false);
                });

                it('should not complete the player', () => {
                    prompt.onMenuCommand(player1, '');
                    expect(prompt.completePlayer).not.toHaveBeenCalled();
                });
            });
        });
    });
});
