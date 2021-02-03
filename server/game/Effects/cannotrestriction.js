const EffectValue = require('./EffectValue');

class CannotRestriction extends EffectValue {
    constructor(type, condition, effectTarget = null) {
        super();
        this.type = type;
        this.condition = condition;
        this.effectTarget = effectTarget;
    }

    getValue(target) {
        return new CannotRestriction(this.type, this.condition, target);
    }

    isMatch(type, abilityContext) {
        return this.type === type && this.checkCondition(abilityContext);
    }

    checkCondition(context) {
        if (!this.condition) {
            return true;
        } else if (!context) {
            return false;
        }

        return this.condition(context, this.effectTarget);
    }
}

module.exports = CannotRestriction;
