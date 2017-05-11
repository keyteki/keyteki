/* global describe, it, beforeEach, expect, jasmine */
/* eslint camelcase: 0, no-invalid-this: 0 */

const _ = require('underscore');
const Player = require('../../../server/game/player.js');

describe('Player', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['on', 'getOtherPlayer', 'raiseEvent', 'raiseMergedEvent', 'playerDecked']);

        this.player = new Player('1', 'Player 1', true, this.gameSpy);
        this.player.initialise();

        this.selectedPlotSpy = jasmine.createSpyObj('plot', ['flipFaceup', 'moveTo', 'play']);
        this.selectedPlotSpy.uuid = '111';
        this.selectedPlotSpy.location = 'plot deck';
        this.selectedPlotSpy.controller = this.player;
        this.anotherPlotSpy = jasmine.createSpyObj('plot', ['flipFaceup', 'moveTo', 'play']);
        this.anotherPlotSpy.uuid = '222';
        this.anotherPlotSpy.location = 'plot deck';
        this.anotherPlotSpy.controller = this.player;

        this.player.selectedPlot = this.selectedPlotSpy;
        this.player.plotDeck = _([this.selectedPlotSpy, this.anotherPlotSpy]);
    });

    describe('flipPlotFaceup()', function() {
        describe('on any flip', function() {
            beforeEach(function() {
                this.player.flipPlotFaceup();
            });

            it('should flip the selected plot face up', function() {
                expect(this.selectedPlotSpy.flipFaceup).toHaveBeenCalled();
            });

            it('should put the selected plot into play', function() {
                expect(this.selectedPlotSpy.play).toHaveBeenCalled();
            });

            it('should move the plot to the active plot slot', function() {
                expect(this.selectedPlotSpy.moveTo).toHaveBeenCalledWith('active plot');
                expect(this.player.activePlot).toBe(this.selectedPlotSpy);
            });

            it('should unselect the plot', function() {
                expect(this.player.selectedPlot).toBeFalsy();
            });

            it('should remove the selected plot from the plot deck', function() {
                expect(this.player.plotDeck).not.toContain(this.selectedPlotSpy);
            });
        });

        describe('when there is an active plot', function() {
            beforeEach(function() {
                this.activePlotSpy = jasmine.createSpyObj('plot', ['leavesPlay', 'moveTo']);
                this.activePlotSpy.location = 'active plot';
                this.activePlotSpy.controller = this.player;
                this.player.activePlot = this.activePlotSpy;

                this.player.flipPlotFaceup();
            });

            it('should move the plot to the revealed plots pile', function() {
                expect(this.activePlotSpy.moveTo).toHaveBeenCalledWith('revealed plots');
                expect(this.player.plotDiscard).toContain(this.activePlotSpy);
            });

            it('should have the plot leave play', function() {
                expect(this.activePlotSpy.leavesPlay).toHaveBeenCalled();
            });

            it('should raise the onCardLeftPlay event', function() {
                expect(this.gameSpy.raiseMergedEvent).toHaveBeenCalledWith('onCardLeftPlay', { player: this.player, card: this.activePlotSpy });
            });
        });
    });

    describe('recyclePlots()', function() {
        describe('when there are no plots left', function() {
            beforeEach(function() {
                this.player.activePlot = this.selectedPlot;
                this.player.plotDeck = _([]);
                this.player.plotDiscard = _([this.anotherPlotSpy]);
                this.anotherPlotSpy.location = 'revealed plots';

                this.player.recyclePlots();
            });

            it('should move the contents of the used plots pile back to the plots pile', function() {
                expect(this.anotherPlotSpy.moveTo).toHaveBeenCalledWith('plot deck');
                expect(this.player.plotDeck).toContain(this.anotherPlotSpy);
                expect(this.player.plotDiscard).not.toContain(this.anotherPlotSpy);
            });

            it('should not move the just revealed plot to any of the piles', function() {
                expect(this.player.plotDeck).not.toContain(this.selectedPlotSpy);
                expect(this.player.plotDiscard).not.toContain(this.selectedPlotSpy);
            });
        });

        describe('when there are plots left', function() {
            beforeEach(function() {
                this.player.plotDeck = _([this.selectedPlot]);
                this.player.plotDiscard = _([this.anotherPlotSpy]);
                this.anotherPlotSpy.location = 'revealed plots';

                this.player.recyclePlots();
            });

            it('should not move the contents of the used plots pile back to the plots pile', function() {
                expect(this.anotherPlotSpy.moveTo).not.toHaveBeenCalledWith('plot deck');
                expect(this.player.plotDeck).not.toContain(this.anotherPlotSpy);
                expect(this.player.plotDiscard).toContain(this.anotherPlotSpy);
            });
        });
    });
});
