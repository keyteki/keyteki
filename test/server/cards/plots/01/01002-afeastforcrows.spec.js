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
        this.plot.moveTo('active plot');
    });

    describe('when revealed', function() {
        beforeEach(function() {
            this.plot.onReveal();
        });

        it('should register its onDominanceDetermined handler', function() {
            expect(this.gameSpy.on).toHaveBeenCalledWith('onDominanceDetermined', jasmine.any(Function));
        });
    });

    describe('when card leaves play', function() {
        beforeEach(function() {
            this.plot.leavesPlay();
            this.plot.moveTo('revealed plots');
        });

        it('should unregister its onDominanceDetermined handler', function() {
            expect(this.gameSpy.removeListener).toHaveBeenCalledWith('onDominanceDetermined', jasmine.any(Function));
        });
    });

    describe('when dominance finished', function() {
        beforeEach(function() {
            this.plot.onDominanceDetermined({}, this.playerSpy);
        });

        describe('and our owner won', function() {
            it('should add 2 power to our owner', function() {
                expect(this.gameSpy.addPower).toHaveBeenCalledWith(this.playerSpy, 2);
            });
        });

        describe('and our owner did not win', function() {
            beforeEach(function() {
                this.gameSpy.addPower.calls.reset();

                this.plot.onDominanceDetermined({}, this.otherPlayerSpy);
            });

            it('should not add any power', function() {
                expect(this.gameSpy.addPower).not.toHaveBeenCalled();
            });
        });
    });
});
