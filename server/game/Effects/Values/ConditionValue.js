import EffectValue from './EffectValue.js';

class ConditionValue extends EffectValue {
    constructor(condition) {
        super(condition);
        this.condition = condition || (() => true);
    }

    getValue() {
        return this;
    }

    checkCondition(abilityContext, effectContext) {
        if (!this.condition) {
            return true;
        }
        if (!abilityContext) {
            return false;
        }
        return this.condition(abilityContext.source, abilityContext, effectContext);
    }
}

export default ConditionValue;
