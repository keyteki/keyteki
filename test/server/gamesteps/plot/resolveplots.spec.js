/*global describe, it, beforeEach, expect, jasmine, spyOn*/
/* eslint no-invalid-this: 0 */

const ResolvePlots = require('../../../../server/game/gamesteps/plot/resolveplots.js');
const Game = require('../../../../server/game/game.js');
const Player = require('../../../../server/game/player.js');
const PlotCard = require('../../../../server/game/plotcard.js');

describe('the ResolvePlots', function() {
    beforeEach(function() {
        this.game = new Game({}, '');
        this.player = new Player('1', 'Player 1', true, this.game);
        this.otherPlayer = new Player('2', 'Player 2', false, this.game);
        this.otherPlayer.firstPlayer = true;

        this.game.players[this.player.id] = this.player;
        this.game.players[this.otherPlayer.id] = this.otherPlayer;

        this.player.activePlot = new PlotCard({}, {});
        this.otherPlayer.activePlot = new PlotCard({}, {});

        spyOn(this.player.activePlot, 'onReveal');
        spyOn(this.otherPlayer.activePlot, 'onReveal');
        spyOn(this.game, 'promptWithMenu');
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

            it('should call the onReveal for the plot', function() {
                this.prompt.continue();
                expect(this.player.activePlot.onReveal).toHaveBeenCalledWith(this.player);
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

            it('should not call onReveal on any plot', function() {
                this.prompt.continue();
                expect(this.player.activePlot.onReveal).not.toHaveBeenCalled();
                expect(this.otherPlayer.activePlot.onReveal).not.toHaveBeenCalled();
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
            it('should not call onReveal', function() {
                this.prompt.resolvePlayer(this.player, 54321);
                expect(this.player.activePlot.onReveal).not.toHaveBeenCalled();
                expect(this.otherPlayer.activePlot.onReveal).not.toHaveBeenCalled();
            });

            it('should not modify the resolution list', function() {
                this.prompt.resolvePlayer(this.player, 54321);
                expect(this.prompt.playersWithRevealEffects).toEqual([this.player, this.otherPlayer]);
            });
        });

        describe('when the player ID does exist', function() {
            it('should call onReveal', function() {
                this.prompt.resolvePlayer(this.player, this.otherPlayer.id);
                expect(this.otherPlayer.activePlot.onReveal).toHaveBeenCalledWith(this.otherPlayer);
            });

            it('should remove the resolved player from the list', function() {
                this.prompt.resolvePlayer(this.player, this.otherPlayer.id);
                expect(this.prompt.playersWithRevealEffects).toEqual([this.player]);
            });
        });
    });
});
