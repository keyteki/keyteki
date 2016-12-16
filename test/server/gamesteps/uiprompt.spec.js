/*global describe, it, beforeEach, expect, spyOn*/

const UiPrompt = require('../../../server/game/gamesteps/uiprompt.js');
const Game = require('../../../server/game/game.js');
const Player = require('../../../server/game/player.js');

describe('the UiPrompt', () => {
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
        game.players[player1.name] = player1;
        game.players[player2.name] = player2;
        prompt = new UiPrompt(game);
        spyOn(prompt, 'activePrompt').and.returnValue(activePrompt);
        spyOn(prompt, 'waitingPrompt').and.returnValue(waitingPrompt);
        spyOn(prompt, 'activeCondition').and.callFake(player => {
            return player === player2;
        });
        spyOn(player1, 'setPrompt');
        spyOn(player2, 'setPrompt');
        spyOn(player1, 'cancelPrompt');
        spyOn(player2, 'cancelPrompt');
    });

    describe('the continue() function', () => {
        describe('when the prompt is incomplete', () => {
            beforeEach(() => {
                spyOn(prompt, 'isComplete').and.returnValue(false);
            });

            it('should set the active prompt for players meeting the active condition', () => {
                prompt.continue();
                expect(player2.setPrompt).toHaveBeenCalledWith(activePrompt);
            });

            it('should set the waiting prompt for players that do not meet the active condition', () => {
                prompt.continue();
                expect(player1.setPrompt).toHaveBeenCalledWith(waitingPrompt);
            });

            it('should return false', () => {
                expect(prompt.continue()).toBe(false);
            });
        });

        describe('when the prompt is complete', () => {
            beforeEach(() => {
                spyOn(prompt, 'isComplete').and.returnValue(true);
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
