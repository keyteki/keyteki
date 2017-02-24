/* global describe, it, beforeEach, expect, jasmine */
/* eslint camelcase: 0, no-invalid-this: 0 */

const Player = require('../../../server/game/player.js');

describe('Player', function () {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['drop', 'getOtherPlayer', 'playerDecked']);

        this.player = new Player('1', 'Test 1', true, this.gameSpy);

        this.reducerSpy = jasmine.createSpyObj('reducer', ['canReduce', 'markUsed', 'isExpired', 'unregisterEvents']);
        this.reducerSpy.amount = 1;
        this.reducer2Spy = jasmine.createSpyObj('reducer2', ['canReduce', 'markUsed', 'isExpired', 'unregisterEvents']);
        this.cardSpy = jasmine.createSpyObj('card', ['getCost', 'getAmbushCost']);
    });

    describe('getReducedCost()', function () {
        describe('when marshaling', function() {
            beforeEach(function() {
                this.cardSpy.getCost.and.returnValue(4);
            });

            describe('and there are no reducers', function() {
                it('should return the printed cost of the card', function() {
                    expect(this.player.getReducedCost('marshal', this.cardSpy)).toBe(4);
                });
            });

            describe('when there are reducers but they cannot reduce the card', function() {
                beforeEach(function() {
                    this.reducerSpy.canReduce.and.returnValue(false);
                    this.player.addCostReducer(this.reducerSpy);
                });

                it('should return the printed cost of the card', function() {
                    expect(this.player.getReducedCost('marshal', this.cardSpy)).toBe(4);
                });
            });

            describe('when there are eligible reducers', function() {
                beforeEach(function() {
                    this.reducerSpy.canReduce.and.returnValue(true);
                    this.player.addCostReducer(this.reducerSpy);
                });

                it('should return the reduced cost of the card', function() {
                    expect(this.player.getReducedCost('marshal', this.cardSpy)).toBe(3);
                });
            });
        });

        describe('when ambushing', function() {
            beforeEach(function() {
                this.cardSpy.getAmbushCost.and.returnValue(4);
            });

            describe('and there are no reducers', function() {
                it('should return the printed cost of the card', function() {
                    expect(this.player.getReducedCost('ambush', this.cardSpy)).toBe(4);
                });
            });

            describe('when there are reducers but they cannot reduce the card', function() {
                beforeEach(function() {
                    this.reducerSpy.canReduce.and.returnValue(false);
                    this.player.addCostReducer(this.reducerSpy);
                });

                it('should return the printed cost of the card', function() {
                    expect(this.player.getReducedCost('ambush', this.cardSpy)).toBe(4);
                });
            });

            describe('when there are eligible reducers', function() {
                beforeEach(function() {
                    this.reducerSpy.canReduce.and.returnValue(true);
                    this.player.addCostReducer(this.reducerSpy);
                });

                it('should return the reduced cost of the card', function() {
                    expect(this.player.getReducedCost('ambush', this.cardSpy)).toBe(3);
                });
            });
        });
    });

    describe('markUsedReducers()', function() {
        beforeEach(function() {
            this.player.addCostReducer(this.reducerSpy);
            this.player.addCostReducer(this.reducer2Spy);
            this.reducerSpy.canReduce.and.returnValue(true);
            this.player.markUsedReducers('marshal', this.cardSpy);
        });

        it('should check that the reducers are eligible', function() {
            expect(this.reducerSpy.canReduce).toHaveBeenCalledWith('marshal', this.cardSpy);
            expect(this.reducer2Spy.canReduce).toHaveBeenCalledWith('marshal', this.cardSpy);
        });

        it('should mark the eligible reducers as used', function() {
            expect(this.reducerSpy.markUsed).toHaveBeenCalled();
            expect(this.reducer2Spy.markUsed).not.toHaveBeenCalled();
        });

        describe('when marking the reducer as used causes it to expire', function() {
            beforeEach(function() {
                this.reducerSpy.markUsed.and.callFake(() => {
                    this.reducerSpy.isExpired.and.returnValue(true);
                });
                this.player.markUsedReducers('marshal', this.cardSpy);
            });

            it('should remove the expired reducer from the list', function() {
                expect(this.player.costReducers).toEqual([this.reducer2Spy]);
            });

            it('should unregister events for the expired reducer', function() {
                expect(this.reducerSpy.unregisterEvents).toHaveBeenCalled();
                expect(this.reducer2Spy.unregisterEvents).not.toHaveBeenCalled();
            });
        });
    });
});
