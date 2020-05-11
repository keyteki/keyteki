const EffectValue = require('./EffectValue');

class CannotRestriction extends EffectValue {
    constructor(type, condition) {
        super();
        this.type = type;
        this.condition = condition;
    }

    getValue() {
        return this;
    }

    isMatch(type, abilityContext, abilityType) {
        return this.type === type && this.checkCondition(abilityContext, abilityType);
    }

    checkCondition(context, abilityType) {
        if(!this.condition) {
            return true;
        } else if(!context) {
            return false;
        }

        return this.condition(context, abilityType);
    }
}

module.exports = CannotRestriction;
