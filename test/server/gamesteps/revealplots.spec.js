/*global describe, it, beforeEach, expect, jasmine*/
/* eslint camelcase: 0, no-invalid-this: 0 */

const RevealPlots = require('../../../server/game/gamesteps/revealplots.js');

describe('RevealPlots', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['addMessage', 'getPlayers', 'raiseEvent']);
        this.phase = new RevealPlots(this.gameSpy, []);
    });

    describe('getInitiativeResult()', function() {
        beforeEach(function() {
            this.player1Spy = jasmine.createSpyObj('player', ['getTotalInitiative', 'getTotalPower']);
            this.player2Spy = jasmine.createSpyObj('player', ['getTotalInitiative', 'getTotalPower']);
            this.gameSpy.getPlayers.and.returnValue([this.player1Spy, this.player2Spy]);
        });

        describe('when one player has higher initiative', function() {
            beforeEach(function() {
                this.player1Spy.getTotalInitiative.and.returnValue(4);
                this.player1Spy.getTotalPower.and.returnValue(3);

                this.player2Spy.getTotalInitiative.and.returnValue(5);
                this.player2Spy.getTotalPower.and.returnValue(5);

                this.result = this.phase.getInitiativeResult();
            });

            it('should set the winner to that player', function() {
                expect(this.result).toEqual(jasmine.objectContaining({
                    initiativeTied: false,
                    powerTied: false,
                    player: this.player2Spy
                }));
            });
        });

        describe('when initiative is tied but one player has lower power', function() {
            beforeEach(function() {
                this.player1Spy.getTotalInitiative.and.returnValue(5);
                this.player1Spy.getTotalPower.and.returnValue(3);

                this.player2Spy.getTotalInitiative.and.returnValue(5);
                this.player2Spy.getTotalPower.and.returnValue(5);

                this.result = this.phase.getInitiativeResult();
            });

            it('should set the winner to that player', function() {
                expect(this.result).toEqual(jasmine.objectContaining({
                    initiativeTied: true,
                    powerTied: false,
                    player: this.player1Spy
                }));
            });
        });

        describe('when initiative and power are tied', function() {
            beforeEach(function() {
                this.player1Spy.getTotalInitiative.and.returnValue(5);
                this.player1Spy.getTotalPower.and.returnValue(3);

                this.player2Spy.getTotalInitiative.and.returnValue(5);
                this.player2Spy.getTotalPower.and.returnValue(3);

                // Set up sampling function to just return the last entry.
                this.sampleFunc = jasmine.createSpy('sample');
                this.sampleFunc.and.callFake(array => array[array.length - 1]);

                this.result = this.phase.getInitiativeResult(this.sampleFunc);
            });

            it('should set the winner at random', function() {
                expect(this.sampleFunc).toHaveBeenCalled();
                expect(this.result).toEqual(jasmine.objectContaining({
                    initiativeTied: true,
                    powerTied: true,
                    player: this.player2Spy
                }));
            });
        });
    });
});
