/*global describe, it, beforeEach, expect, jasmine */
/* eslint no-invalid-this: 0 */

const ResolvePlots = require('../../../../server/game/gamesteps/plot/resolveplots.js');

describe('the ResolvePlots', function() {
    beforeEach(function() {
        this.game = jasmine.createSpyObj('game', ['getPlayerById', 'getFirstPlayer', 'promptWithMenu']);
        this.player = jasmine.createSpyObj('player', ['setPrompt', 'cancelPrompt', 'revealPlot']);
        this.otherPlayer = jasmine.createSpyObj('player', ['setPrompt', 'cancelPrompt', 'revealPlot']);

        this.game.getFirstPlayer.and.returnValue(this.otherPlayer);
    });

    describe('the continue() function', function() {
        describe('when no players need resolution', function() {
            beforeEach(function() {
                this.prompt = new ResolvePlots(this.game, []);
            });

            it('should not prompt for ordering', function() {
                this.prompt.continue();
                expect(this.game.promptWithMenu).not.toHaveBeenCalled();
            });

            it('should return true', function() {
                expect(this.prompt.continue()).toBe(true);
            });
        });

        describe('when only one player needs resolution', function() {
            beforeEach(function() {
                this.prompt = new ResolvePlots(this.game, [this.player]);
            });

            it('should not prompt for ordering', function() {
                this.prompt.continue();
                expect(this.game.promptWithMenu).not.toHaveBeenCalled();
            });

            it('should reveal the plot', function() {
                this.prompt.continue();
                expect(this.player.revealPlot).toHaveBeenCalled();
            });

            it('should return true', function() {
                expect(this.prompt.continue()).toBe(true);
            });
        });

        describe('when only more than one player needs resolution', function() {
            beforeEach(function() {
                this.prompt = new ResolvePlots(this.game, [this.player, this.otherPlayer]);
            });

            it('should prompt the first player for ordering', function() {
                this.prompt.continue();
                expect(this.game.promptWithMenu).toHaveBeenCalledWith(this.otherPlayer, this.prompt, jasmine.any(Object));
            });

            it('should not reveal any plot', function() {
                this.prompt.continue();
                expect(this.player.revealPlot).not.toHaveBeenCalled();
                expect(this.otherPlayer.revealPlot).not.toHaveBeenCalled();
            });

            it('should return false', function() {
                expect(this.prompt.continue()).toBe(false);
            });
        });
    });

    describe('the resolvePlayer() function', function() {
        beforeEach(function() {
            this.prompt = new ResolvePlots(this.game, [this.player, this.otherPlayer]);
        });

        describe('when the player ID does not exist', function() {
            beforeEach(function() {
                this.game.getPlayerById.and.returnValue(undefined);
            });

            it('should not reveal a plot', function() {
                this.prompt.resolvePlayer(this.player, 54321);
                expect(this.player.revealPlot).not.toHaveBeenCalled();
                expect(this.otherPlayer.revealPlot).not.toHaveBeenCalled();
            });

            it('should not modify the resolution list', function() {
                this.prompt.resolvePlayer(this.player, 54321);
                expect(this.prompt.playersWithRevealEffects).toEqual([this.player, this.otherPlayer]);
            });
        });

        describe('when the player ID does exist', function() {
            beforeEach(function() {
                this.game.getPlayerById.and.returnValue(this.otherPlayer);
            });

            it('should call onReveal', function() {
                this.prompt.resolvePlayer(this.player, this.otherPlayer.id);
                expect(this.otherPlayer.revealPlot).toHaveBeenCalled();
            });

            it('should remove the resolved player from the list', function() {
                this.prompt.resolvePlayer(this.player, this.otherPlayer.id);
                expect(this.prompt.playersWithRevealEffects).toEqual([this.player]);
            });
        });
    });
});
