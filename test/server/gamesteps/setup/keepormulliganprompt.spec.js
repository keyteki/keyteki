/*global describe, it, beforeEach, expect, jasmine*/

const KeepOrMulliganPrompt = require('../../../../server/game/gamesteps/setup/keepormulliganprompt.js');

describe('the KeepOrMulliganPrompt', () => {
    var prompt;
    var gameSpy;
    var playerSpy;

    beforeEach(() => {
        gameSpy = jasmine.createSpyObj('game', ['addMessage']);
        playerSpy = jasmine.createSpyObj('player', ['keep', 'mulligan']);
        prompt = new KeepOrMulliganPrompt(gameSpy);
    });

    describe('the onMenuCommand() function', () => {
        describe('when the arg is keep', () => {
            it('should call keep on the player', () => {
                prompt.onMenuCommand(playerSpy, 'keep');
                expect(playerSpy.keep).toHaveBeenCalled();
                expect(playerSpy.mulligan).not.toHaveBeenCalled();
            });
        });

        describe('when the arg is mulligan', () => {
            it('should call mulligan on the player', () => {
                prompt.onMenuCommand(playerSpy, 'mulligan');
                expect(playerSpy.keep).not.toHaveBeenCalled();
                expect(playerSpy.mulligan).toHaveBeenCalled();
            });
        });
    });
});
