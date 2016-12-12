/* global describe, it, expect, jasmine, beforeEach */
/* eslint no-invalid-this: 0 */

const _ = require('underscore');

const cards = require('../../../../../server/game/cards');

describe('A Song of Summer', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['getOtherPlayer', 'on']);
        this.playerSpy = jasmine.createSpyObj('player1', ['findCardInPlayByUuid']);
        this.otherPlayerSpy = jasmine.createSpyObj('player2', ['findCardInPlayByUuid']);
        this.otherPlotSpy = jasmine.createSpyObj('otherPlot', ['hasTrait']);
        this.card1Spy = jasmine.createSpyObj('card1', ['getType']);
        this.card2Spy = jasmine.createSpyObj('card2', ['getType']);
        this.locationSpy = jasmine.createSpyObj('location', ['getType']);

        this.card1Spy.strengthModifier = this.card2Spy.strengthModifier = this.locationSpy.strengthModifier = 0;
        this.playerSpy.game = this.otherPlayerSpy.game = this.gameSpy;

        this.plot = new cards['03050'](this.playerSpy, {});

        this.gameSpy.getOtherPlayer.and.returnValue(this.otherPlayerSpy);
        this.card1Spy.getType.and.returnValue('character');
        this.card2Spy.getType.and.returnValue('character');
        this.locationSpy.getType.and.returnValue('location');

        this.playerSpy.cardsInPlay = _([this.card1Spy, this.card2Spy]);
    });

    describe('When flipped faceup', function() {
        beforeEach(function() {
            this.otherPlayerSpy.selectedPlot = this.otherPlotSpy;
            this.playerSpy.selectedPlot = this.plot;
        });

        describe('When there are no Winter plots revealed', function() {
            beforeEach(function() {
                this.plot.onPlotFlip();
            });

            it('should increase the STR of all characters by 1', function() {
                expect(this.card1Spy.strengthModifier).toBe(1);
                expect(this.card2Spy.strengthModifier).toBe(1);
            });

            it('should not increase the STR of the location', function() {
                expect(this.locationSpy.strengthModifier).toBe(0);
            });

            describe('and another plot is revealed', function() {
                beforeEach(function() {
                    this.playerSpy.activePlot = this.playerSpy.selectedPlot;
                    this.playerSpy.selectedPlot = this.otherPlotSpy;
                    this.otherPlayerSpy.activePlot = this.otherPlotSpy;

                    this.plot.onPlotFlip();
                });

                it('should reset the STR of all characters', function() {
                    expect(this.card1Spy.strengthModifier).toBe(0);
                    expect(this.card2Spy.strengthModifier).toBe(0);
                });
            });
        });

        describe('When there is a winter plot revealed', function() {
            beforeEach(function() {
                this.otherPlotSpy.hasTrait.and.returnValue(true);
            });

            it('should not increase the STR of any characters', function() {
                expect(this.card1Spy.strengthModifier).toBe(0);
                expect(this.card2Spy.strengthModifier).toBe(0);
            });

            describe('and another plot is revealed', function() {
                beforeEach(function() {
                    this.playerSpy.activePlot = this.playerSpy.selectedPlot;
                    this.playerSpy.selectedPlot = this.otherPlotSpy;
                    this.otherPlayerSpy.activePlot = this.otherPlotSpy;

                    this.plot.onPlotFlip();
                });

                it('should not reset the STR of all characters', function() {
                    expect(this.card1Spy.strengthModifier).toBe(0);
                    expect(this.card2Spy.strengthModifier).toBe(0);
                });
            });
        });
    });
});

