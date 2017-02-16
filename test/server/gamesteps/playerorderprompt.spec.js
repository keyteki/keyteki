/*global describe, it, beforeEach, expect, spyOn, jasmine*/
/* eslint camelcase: 0, no-invalid-this: 0 */

const PlayerOrderPrompt = require('../../../server/game/gamesteps/playerorderprompt.js');

describe('the PlayerOrderPrompt', function() {
    beforeEach(function() {
        this.activePrompt = { active: true };
        this.waitingPrompt = { active: false };

        this.game = jasmine.createSpyObj('game', ['getPlayers', 'getPlayersInFirstPlayerOrder']);
        this.player1 = jasmine.createSpyObj('player1', ['setPrompt', 'cancelPrompt']);
        this.player2 = jasmine.createSpyObj('player1', ['setPrompt', 'cancelPrompt']);

        this.game.getPlayers.and.returnValue([this.player1, this.player2]);
        this.game.getPlayersInFirstPlayerOrder.and.returnValue([this.player2, this.player1]);

        this.prompt = new PlayerOrderPrompt(this.game);
        spyOn(this.prompt, 'activePrompt').and.returnValue(this.activePrompt);
        spyOn(this.prompt, 'waitingPrompt').and.returnValue(this.waitingPrompt);
    });

    describe('the continue() function', function() {
        describe('when there is a skip condition', function() {
            beforeEach(function() {
                spyOn(this.prompt, 'skipCondition').and.callFake(p => p === this.player2);
            });

            it('should skip over the matching players', function() {
                this.prompt.continue();
                expect(this.prompt.currentPlayer).toBe(this.player1);
            });
        });

        describe('when the prompt is incomplete', function() {
            it('should prompt players in first-player order', function() {
                this.prompt.continue();
                expect(this.prompt.currentPlayer).toBe(this.player2);
            });

            it('should give the active prompt to the current player', function() {
                this.prompt.continue();
                expect(this.player2.setPrompt).toHaveBeenCalledWith(this.activePrompt);
            });

            it('should give the waiting prompt to the remaining players', function() {
                this.prompt.continue();
                expect(this.player1.setPrompt).toHaveBeenCalledWith(this.waitingPrompt);
            });

            it('should return false', function() {
                expect(this.prompt.continue()).toBe(false);
            });
        });

        describe('when each player has been completed', function() {
            beforeEach(function() {
                this.prompt.completePlayer();
                this.prompt.completePlayer();
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

        describe('when the first player order changes after construction', function() {
            beforeEach(function() {
                this.game.getPlayersInFirstPlayerOrder.and.returnValue([this.player1, this.player2]);
            });

            it('should prompt players in the current first-player order', function() {
                this.prompt.continue();
                expect(this.prompt.currentPlayer).toBe(this.player1);
            });

            it('should give the active prompt to the current player', function() {
                this.prompt.continue();
                expect(this.player1.setPrompt).toHaveBeenCalledWith(this.activePrompt);
            });

            it('should give the waiting prompt to the remaining players', function() {
                this.prompt.continue();
                expect(this.player2.setPrompt).toHaveBeenCalledWith(this.waitingPrompt);
            });

            it('should return false', function() {
                expect(this.prompt.continue()).toBe(false);
            });
        });
    });
});
