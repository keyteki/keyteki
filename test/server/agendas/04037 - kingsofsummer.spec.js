/* global describe, it, expect, beforeEach, jasmine */
/* eslint camelcase: 0, no-invalid-this: 0 */

const KingsOfSummer = require('../../../server/game/cards/agendas/kingsofsummer.js');

describe('Kings Of Summer', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['addMessage', 'getPlayers', 'on']);

        this.plot1 = jasmine.createSpyObj('plot1', ['hasTrait']);
        this.plot2 = jasmine.createSpyObj('plot2', ['hasTrait']);
        this.plot3 = jasmine.createSpyObj('plot3', ['hasTrait']);
        this.plot4 = jasmine.createSpyObj('plot4', ['hasTrait']);

        this.plot1.hasTrait.and.returnValue(false);
        this.plot2.hasTrait.and.returnValue(false);

        this.player1Fake = {};
        this.player1Fake.game = this.gameSpy;
        this.player1Fake.selectedPlot = this.plot1;
        this.player1Fake.selectedPlot.reserveModifier = 0;
        this.player1Fake.selectedPlot.goldModifier = 0;

        this.player2Fake = {};
        this.player2Fake.game = this.gameSpy;
        this.player2Fake.selectedPlot = this.plot2;
        this.player2Fake.selectedPlot.reserveModifier = 0;
        this.player2Fake.selectedPlot.goldModifier = 0;

        this.gameSpy.getPlayers.and.returnValue([this.player1Fake, this.player2Fake]);

        this.agenda = new KingsOfSummer(this.player1Fake, {});
    });

    describe('When flipped faceup', function() {
        beforeEach(function() {
            this.agenda.onPlotFlip();
        });

        it('should increase the reserve modifier of both players plot cards', function() {
            expect(this.player1Fake.selectedPlot.reserveModifier).toBe(1);
            expect(this.player2Fake.selectedPlot.reserveModifier).toBe(1);
        });

        describe('and there is a winter plot revealed', function() {
            beforeEach(function() {
                this.player1Fake.selectedPlot.reserveModifier = 0;
                this.player1Fake.selectedPlot.goldModifier = 0;
                this.player2Fake.selectedPlot.reserveModifier = 0;
                this.player2Fake.selectedPlot.goldModifier = 0;
                
                this.plot2.hasTrait.and.returnValue(true);

                this.agenda.onPlotFlip();
            });

            it('should not increase the owning player\'s plot gold modifier', function() {
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

        describe('and there are no winter plots revealed', function() {
            it('should increase the owning player\'s plot gold modifier', function() {
                expect(this.player1Fake.selectedPlot.goldModifier).toBe(1);
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

                it('should reset the player\'s gold and reserve modifiers', function() {
                    expect(this.plot1.goldModifier).toBe(0);
                    expect(this.plot1.goldModifier).toBe(0);           
                    expect(this.plot1.reserveModifier).toBe(0);
                    expect(this.plot1.reserveModifier).toBe(0);         
                });
            });
        });
    });
});
