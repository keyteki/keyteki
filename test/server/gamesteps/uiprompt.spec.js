const UiPrompt = require('../../../server/game/gamesteps/uiprompt.js');

describe('the UiPrompt', function() {
    beforeEach(function() {
        this.player1 = jasmine.createSpyObj('player', ['setPrompt', 'cancelPrompt']);
        this.player2 = jasmine.createSpyObj('player', ['setPrompt', 'cancelPrompt']);

        this.game = jasmine.createSpyObj('game', ['getPlayers']);
        this.game.getPlayers.and.returnValue([this.player1, this.player2]);

        this.activePrompt = {
            menuTitle: 'Do stuff',
            buttons: [
                { command: 'command', text: 'Do It', arg: 'foo' }
            ]
        };
        this.waitingPrompt = {};

        this.prompt = new UiPrompt(this.game);
        spyOn(this.prompt, 'activePrompt').and.returnValue(this.activePrompt);
        spyOn(this.prompt, 'waitingPrompt').and.returnValue(this.waitingPrompt);
        spyOn(this.prompt, 'activeCondition').and.callFake(player => {
            return player === this.player2;
        });
    });

    describe('the continue() function', function() {
        describe('when the prompt is incomplete', function() {
            beforeEach(function() {
                spyOn(this.prompt, 'isComplete').and.returnValue(false);
            });

            it('should set the active prompt for players meeting the active condition', function() {
                this.prompt.continue();
                expect(this.player2.setPrompt).toHaveBeenCalledWith(this.activePrompt);
            });

            it('should default the command for any buttons on the active prompt', function() {
                this.prompt.activePrompt.and.returnValue({ buttons: [{ text: 'foo' }] });
                this.prompt.continue();
                expect(this.player2.setPrompt).toHaveBeenCalledWith({ buttons: [{ command: 'menuButton', text: 'foo', uuid: this.prompt.uuid }] });
            });

            it('should set the waiting prompt for players that do not meet the active condition', function() {
                this.prompt.continue();
                expect(this.player1.setPrompt).toHaveBeenCalledWith(this.waitingPrompt);
            });

            it('should return false', function() {
                expect(this.prompt.continue()).toBe(false);
            });
        });

        describe('when the prompt is complete', function() {
            beforeEach(function() {
                spyOn(this.prompt, 'isComplete').and.returnValue(true);
            });

            it('should set the cancel prompts for each player', function() {
                this.prompt.continue();
                expect(this.player1.cancelPrompt).toHaveBeenCalled();
                expect(this.player2.cancelPrompt).toHaveBeenCalled();
            });

            it('should return true', function() {
                expect(this.prompt.continue()).toBe(true);
            });
        });
    });
});
