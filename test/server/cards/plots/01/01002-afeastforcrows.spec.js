/* global describe, it, expect, beforeEach, jasmine */
/* eslint camelcase: 0, no-invalid-this: 0 */

const cards = require('../../../../../server/game/cards');
const AFeastForCrows = cards['01002'];

describe('AFeastForCrows', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['on', 'removeListener', 'addPower', 'addMessage']);
        this.playerSpy = jasmine.createSpyObj('player', ['']);
        this.otherPlayerSpy = jasmine.createSpyObj('player2', ['']);

        this.playerSpy.game = this.gameSpy;
        this.otherPlayerSpy.game = this.gameSpy;

        this.plot = new AFeastForCrows(this.playerSpy, {});
    });

    describe('when revealed', function() {
        beforeEach(function() {
            this.plot.onReveal();
        });

        it('should register its afterDominance handler', function() {
            expect(this.gameSpy.on).toHaveBeenCalledWith('afterDominance', this.plot.afterDominance);
        });
    });

    describe('when card leaves play', function() {
        beforeEach(function() {
            this.plot.leavesPlay();
        });

        it('should be marked as not in play', function() {
            expect(this.plot.inPlay).toBe(false);
        });

        it('should unregister its afterDominance handler', function() {
            expect(this.gameSpy.removeListener).toHaveBeenCalledWith('afterDominance', this.plot.afterDominance);
        });
    });

    describe('when dominance finished', function() {
        describe('and this plot is not in play', function() {
            beforeEach(function() {
                this.plot.inPlay = false;
                this.plot.afterDominance({}, this.playerSpy);
            });

            it('should not change any power', function() {
                expect(this.gameSpy.addPower).not.toHaveBeenCalled();
            });
        });

        describe('and this plot is in play', function() {
            beforeEach(function() {
                this.plot.inPlay = true;
                this.plot.afterDominance({}, this.playerSpy);
            });
            
            describe('and our owner won', function() {
                it('should add 2 power to our owner', function() {
                    expect(this.gameSpy.addPower).toHaveBeenCalledWith(this.playerSpy, 2);
                });
            });

            describe('and our owner did not win', function() {
                beforeEach(function() {
                    this.gameSpy.addPower.calls.reset();
                    
                    this.plot.afterDominance({}, this.otherPlayerSpy);
                });

                it('should not add any power', function() {
                    expect(this.gameSpy.addPower).not.toHaveBeenCalled();
                });
            });
        });
    });
});
