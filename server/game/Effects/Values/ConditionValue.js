const EffectValue = require('./EffectValue');

class ConditionValue extends EffectValue {
    constructor(condition) {
        super(condition);
        this.condition = condition || (() => true);
    }

    getValue() {
        return this;
    }

    checkCondition(target, abilityContext, effectContext) {
        if (!this.condition) {
            return true;
        }
        if (!target) {
            return false;
        }
        return this.condition(target, abilityContext, effectContext);
    }
}

module.exports = ConditionValue;
