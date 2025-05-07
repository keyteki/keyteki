const EffectValue = require('./EffectValue');

class ConditionValue extends EffectValue {
    constructor(condition, target = null) {
        super(condition);
        this.condition = condition || (() => true);
        this.target = target;
    }

    getValue(target) {
        return new ConditionValue(this.condition, target);
    }

    checkCondition(abilityContext, effectContext) {
        if (!this.condition) {
            return true;
        }
        if (!abilityContext) {
            return false;
        }
        return this.condition(this.target || abilityContext.source, abilityContext, effectContext);
    }
}

module.exports = ConditionValue;
