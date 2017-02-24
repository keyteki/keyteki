/*global describe, it, beforeEach, expect, jasmine, afterEach */
/*eslint camelcase: 0, no-invalid-this: 0 */

const EventEmitter = require('events');

const AbilityLimit = require('../../server/game/abilitylimit.js');

describe('AbilityLimit', function () {
    beforeEach(function () {
        this.eventEmitterSpy = jasmine.createSpyObj('event emitter', ['on', 'removeListener']);

        this.limit = AbilityLimit.repeatable(2, 'onEventForReset');
    });

    describe('increment()', function() {
        it('should increase the use count', function() {
            this.limit.increment();
            expect(this.limit.useCount).toBe(1);
        });
    });

    describe('isAtMax', function() {
        describe('when below the max', function() {
            beforeEach(function() {
                this.limit.increment();
            });

            it('should return false', function() {
                expect(this.limit.isAtMax()).toBe(false);
            });
        });

        describe('when at the max', function() {
            beforeEach(function() {
                this.limit.increment();
                this.limit.increment();
            });

            it('should return false', function() {
                expect(this.limit.isAtMax()).toBe(true);
            });
        });
    });

    describe('registerEvents()', function() {
        it('should register the event', function() {
            this.limit.registerEvents(this.eventEmitterSpy);
            expect(this.eventEmitterSpy.on).toHaveBeenCalledWith('onEventForReset', jasmine.any(Function));
        });
    });

    describe('unregisterEvents()', function() {
        it('should remove the event', function() {
            this.limit.unregisterEvents(this.eventEmitterSpy);
            expect(this.eventEmitterSpy.removeListener).toHaveBeenCalledWith('onEventForReset', jasmine.any(Function));
        });
    });

    describe('resetting the use count', function() {
        beforeEach(function() {
            this.eventEmitter = new EventEmitter();

            this.limit.registerEvents(this.eventEmitter);
            this.limit.increment();
        });

        afterEach(function() {
            this.limit.unregisterEvents(this.eventEmitter);
        });

        it('should set the use count to 0', function() {
            this.eventEmitter.emit('onEventForReset');
            expect(this.limit.useCount).toBe(0);
        });
    });
});
