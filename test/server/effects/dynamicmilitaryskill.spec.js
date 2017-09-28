const _ = require('underscore');

const Effects = require('../../../server/game/effects.js');

describe('Effects.dynamicMilitarySkill', function() {
    beforeEach(function() {
        this.context = {};
        this.calculateMethod = jasmine.createSpy('calculateMethod');

        this.card1 = jasmine.createSpyObj('card1', ['modifyMilitarySkill']);
        this.card1.uuid = '1111';
        this.card2 = jasmine.createSpyObj('card2', ['modifyMilitarySkill']);
        this.card2.uuid = '2222';

        this.effect = Effects.dynamicMilitarySkill(this.calculateMethod);
    });

    describe('apply()', function() {
        beforeEach(function() {
            this.calculateMethod.and.returnValue(3);
            this.effect.apply(this.card1, this.context);
            this.calculateMethod.and.returnValue(4);
            this.effect.apply(this.card2, this.context);
        });

        it('should modify military skill based on the result of the calculate method', function() {
            expect(this.card1.modifyMilitarySkill).toHaveBeenCalledWith(3, true);
            expect(this.card2.modifyMilitarySkill).toHaveBeenCalledWith(4, true);
        });

        it('should store the modifier for each card on context', function() {
            expect(_.keys(this.context.dynamicMilitarySkill).length).toBe(2);
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
            expect(this.card1.modifyMilitarySkill).toHaveBeenCalledWith(1, true);
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
            expect(this.card1.modifyMilitarySkill).toHaveBeenCalledWith(-3, false);
            expect(this.card2.modifyMilitarySkill).toHaveBeenCalledWith(-4, false);
        });
    });
});
