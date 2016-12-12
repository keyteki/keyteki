/* global describe, it, expect, beforeEach, jasmine */
/* eslint camelcase: 0, no-invalid-this: 0 */

const KingsOfWinter = require('../../../server/game/cards/agendas/kingsofwinter.js');

describe('Kings Of Winter', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['addMessage', 'getPlayers', 'on', 'getOtherPlayer']);

        this.plot1 = jasmine.createSpyObj('plot1', ['hasTrait']);
        this.plot2 = jasmine.createSpyObj('plot2', ['hasTrait']);
        this.plot3 = jasmine.createSpyObj('plot3', ['hasTrait']);
        this.plot4 = jasmine.createSpyObj('plot4', ['hasTrait']);

        this.plot1.hasTrait.and.returnValue(false);
        this.plot2.hasTrait.and.returnValue(false);

        this.player1Fake = {};
        this.player1Fake.game = this.gameSpy;
        this.player1Fake.selectedPlot = this.plot1;
        this.player1Fake.selectedPlot.reserveModifier = 5;
        this.player1Fake.selectedPlot.goldModifier = 0;

        this.player2Fake = {};
        this.player2Fake.game = this.gameSpy;
        this.player2Fake.selectedPlot = this.plot2;
        this.player2Fake.selectedPlot.reserveModifier = 5;
        this.player2Fake.selectedPlot.goldModifier = 0;

        this.gameSpy.getPlayers.and.returnValue([this.player1Fake, this.player2Fake]);
        this.gameSpy.getOtherPlayer.and.returnValue(this.player2Fake);

        this.agenda = new KingsOfWinter(this.player1Fake, {});
    });

    describe('When flipped faceup', function() {
        beforeEach(function() {
            this.agenda.onPlotFlip();
        });

        it('should reduce the reserve modifier of both players plot cards', function() {
            expect(this.player1Fake.selectedPlot.reserveModifier).toBe(4);
            expect(this.player2Fake.selectedPlot.reserveModifier).toBe(4);
        });

        describe('and I have a winter plot revealed', function() {
            beforeEach(function() {
                this.player1Fake.selectedPlot.reserveModifier = 0;
                this.player1Fake.selectedPlot.goldModifier = 0;
                this.player2Fake.selectedPlot.reserveModifier = 0;
                this.player2Fake.selectedPlot.goldModifier = 0;

                this.plot1.hasTrait.and.returnValue(true);

                this.agenda.onPlotFlip();
            });

            describe('and my opponent has a summer plot revealed', function() {
                beforeEach(function() {
                    this.player1Fake.selectedPlot.reserveModifier = 0;
                    this.player1Fake.selectedPlot.goldModifier = 0;
                    this.player2Fake.selectedPlot.reserveModifier = 0;
                    this.player2Fake.selectedPlot.goldModifier = 0;
                    this.plot2.hasTrait.and.returnValue(true);

                    this.agenda.onPlotFlip();
                });

                it('should not reduce the opponent\'s gold modifier', function() {
                    expect(this.player1Fake.selectedPlot.goldModifier).toBe(0);
                    expect(this.player2Fake.selectedPlot.goldModifier).toBe(0);
                });

                describe('and then a new plot is flipped faceup', function() {
                    beforeEach(function() {
                        this.player1Fake.activePlot = this.player1Fake.selectedPlot;
                        this.player2Fake.activePlot = this.player2Fake.selectedPlot;
                        this.player1Fake.selectedPlot = this.plot3;
                        this.player2Fake.selectedPlot = this.plot4;

                        this.agenda.onPlotFlip();
                    });

                    it('should restore the reserve modifier of both players plots', function() {
                        expect(this.plot1.reserveModifier).toBe(0);
                        expect(this.plot2.reserveModifier).toBe(0);
                    });
                });
            });

            describe('and my opponent does not have a summer plot revealed', function() {
                it('should reduce the opponent\'s gold modifier by 1', function() {
                    expect(this.player1Fake.selectedPlot.goldModifier).toBe(0);
                    expect(this.player2Fake.selectedPlot.goldModifier).toBe(-1);
                });

                describe('and then a new plot is flipped faceup', function() {
                    beforeEach(function() {
                        this.player1Fake.activePlot = this.player1Fake.selectedPlot;
                        this.player2Fake.activePlot = this.player2Fake.selectedPlot;
                        this.player1Fake.selectedPlot = this.plot3;
                        this.player2Fake.selectedPlot = this.plot4;

                        this.agenda.onPlotFlip();
                    });

                    it('should restore the reserve and gold modifier of both players plots', function() {
                        expect(this.plot1.reserveModifier).toBe(0);
                        expect(this.plot1.goldModifier).toBe(0);
                        expect(this.plot2.reserveModifier).toBe(0);
                        expect(this.plot1.goldModifier).toBe(0);
                    });
                });
            });
        });
    });
});
