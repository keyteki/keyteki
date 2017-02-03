/*global describe, it, beforeEach, expect, spyOn*/

const PlayerOrderPrompt = require('../../../server/game/gamesteps/playerorderprompt.js');
const Game = require('../../../server/game/game.js');
const Player = require('../../../server/game/player.js');

describe('the PlayerOrderPrompt', () => {
    var prompt;
    var game = {};
    var player1;
    var player2;
    var activePrompt = {};
    var waitingPrompt = {};

    beforeEach(() => {
        game = new Game('1', 'Test Game');
        player1 = new Player('1', { username: 'Player 1' }, true, game);
        player2 = new Player('2', { username: 'Player 2' }, false, game);
        player2.firstPlayer = true;
        game.playersAndSpectators[0] = player1;
        game.playersAndSpectators[1] = player2;
        prompt = new PlayerOrderPrompt(game);
        spyOn(prompt, 'activePrompt').and.returnValue(activePrompt);
        spyOn(prompt, 'waitingPrompt').and.returnValue(waitingPrompt);
        spyOn(player1, 'setPrompt');
        spyOn(player2, 'setPrompt');
        spyOn(player1, 'cancelPrompt');
        spyOn(player2, 'cancelPrompt');
    });

    describe('the continue() function', () => {
        describe('when there is a skip condition', () => {
            beforeEach(() => {
                spyOn(prompt, 'skipCondition').and.callFake(p => p === player2);
            });

            it('should skip over the matching players', () => {
                prompt.continue();
                expect(prompt.currentPlayer).toBe(player1);
            });
        });

        describe('when the prompt is incomplete', () => {
            it('should prompt players in first-player order', () => {
                prompt.continue();
                expect(prompt.currentPlayer).toBe(player2);
            });

            it('should give the active prompt to the current player', () => {
                prompt.continue();
                expect(player2.setPrompt).toHaveBeenCalledWith(activePrompt);
            });

            it('should give the waiting prompt to the remaining players', () => {
                prompt.continue();
                expect(player1.setPrompt).toHaveBeenCalledWith(waitingPrompt);
            });

            it('should return false', () => {
                expect(prompt.continue()).toBe(false);
            });
        });

        describe('when each player has been completed', () => {
            beforeEach(() => {
                prompt.completePlayer();
                prompt.completePlayer();
            });

            it('should set the cancel prompts for each player', () => {
                prompt.continue();
                expect(player1.cancelPrompt).toHaveBeenCalled();
                expect(player2.cancelPrompt).toHaveBeenCalled();
            });

            it('should return true', () => {
                expect(prompt.continue()).toBe(true);
            });
        });
    });
});
