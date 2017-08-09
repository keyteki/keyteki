/*global describe, it, beforeEach, expect, jasmine*/

const KeepOrMulliganPrompt = require('../../../../server/game/gamesteps/setup/keepormulliganprompt.js');

describe('the KeepOrMulliganPrompt', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['addMessage', 'raiseEvent']);
        this.playerSpy = jasmine.createSpyObj('player', ['keep', 'mulligan']);
        this.prompt = new KeepOrMulliganPrompt(this.gameSpy);
    });

    describe('the onMenuCommand() function', function() {
        describe('when the arg is keep', function() {
            beforeEach(function() {
                this.prompt.onMenuCommand(this.playerSpy, 'keep');
            });

    beforeEach(() => {
        gameSpy = jasmine.createSpyObj('game', ['addMessage']);
        playerSpy = jasmine.createSpyObj('player', ['keep', 'mulligan']);
        prompt = new KeepOrMulliganPrompt(gameSpy);
    });

            it('should raise the onPlayerKeepHandOrMerged event', function() {
                expect(this.gameSpy.raiseEvent).toHaveBeenCalledWith('onPlayerKeepHandOrMulligan', jasmine.objectContaining({ player: this.playerSpy, choice: 'keep' }));
            });
        });

        describe('when the arg is mulligan', function() {
            beforeEach(function() {
                this.prompt.onMenuCommand(this.playerSpy, 'mulligan');
            });

            it('should call mulligan on the player', function() {
                expect(this.playerSpy.keep).not.toHaveBeenCalled();
                expect(this.playerSpy.mulligan).toHaveBeenCalled();
            });

            it('should raise the onPlayerKeepHandOrMerged event', function() {
                expect(this.gameSpy.raiseEvent).toHaveBeenCalledWith('onPlayerKeepHandOrMulligan', jasmine.objectContaining({ player: this.playerSpy, choice: 'mulligan' }));
            });
        });
    });
});
