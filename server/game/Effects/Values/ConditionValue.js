const EffectValue = require('./EffectValue');

class ConditionValue extends EffectValue {
    constructor(condition) {
        super(condition);
        this.condition = condition || (() => true);
    }

    getValue() {
        return this;
    }

    match(abilityContext) {
        if (!this.condition) {
            return true;
        }
        if (!abilityContext) {
            return false;
        }
        return this.condition(abilityContext.source, abilityContext, this.effectContext);
    }
}

module.exports = ConditionValue;
