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

    isMatch(type, abilityContext) {
        return this.type === type && this.checkCondition(abilityContext);
    }

    checkCondition(context) {
        if (!this.condition) {
            return true;
        } else if (!context) {
            return false;
        }

        return this.condition(context);
    }
}

module.exports = CannotRestriction;
