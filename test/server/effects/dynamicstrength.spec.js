/*global describe, it, beforeEach, expect, jasmine*/
/* eslint camelcase: 0, no-invalid-this: 0 */

const _ = require('underscore');

const Effects = require('../../../server/game/effects.js');

describe('Effects.dynamicStrength', function() {
    beforeEach(function() {
        this.context = {};
        this.calculateMethod = jasmine.createSpy('calculateMethod');

        this.card1 = jasmine.createSpyObj('card1', ['modifyStrength']);
        this.card1.uuid = '1111';
        this.card2 = jasmine.createSpyObj('card2', ['modifyStrength']);
        this.card2.uuid = '2222';

        this.effect = Effects.dynamicStrength(this.calculateMethod);
    });

    describe('apply()', function() {
        beforeEach(function() {
            this.calculateMethod.and.returnValue(3);
            this.effect.apply(this.card1, this.context);
            this.calculateMethod.and.returnValue(4);
            this.effect.apply(this.card2, this.context);
        });

        it('should modify strength based on the result of the calculate method', function() {
            expect(this.card1.modifyStrength).toHaveBeenCalledWith(3, true);
            expect(this.card2.modifyStrength).toHaveBeenCalledWith(4, true);
        });

        it('should store the modifier for each card on context', function() {
            expect(_.keys(this.context.dynamicStrength).length).toBe(2);
        });
    });

    describe('reapply()', function() {
        beforeEach(function() {
            this.calculateMethod.and.returnValue(3);
            this.effect.apply(this.card1, this.context);
            this.calculateMethod.and.returnValue(4);
            this.effect.reapply(this.card1, this.context);
        });

        it('should increase the strength by the difference', function() {
            expect(this.card1.modifyStrength).toHaveBeenCalledWith(1, true);
        });
    });

    describe('unapply()', function() {
        beforeEach(function() {
            this.calculateMethod.and.returnValue(3);
            this.effect.apply(this.card1, this.context);
            this.calculateMethod.and.returnValue(4);
            this.effect.apply(this.card2, this.context);
        });

        it('should reduce the previously applied value', function() {
            this.effect.unapply(this.card1, this.context);
            this.effect.unapply(this.card2, this.context);
            expect(this.card1.modifyStrength).toHaveBeenCalledWith(-3, false);
            expect(this.card2.modifyStrength).toHaveBeenCalledWith(-4, false);
        });
    });
});
