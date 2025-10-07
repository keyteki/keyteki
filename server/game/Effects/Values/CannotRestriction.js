import EffectValue from './EffectValue.js';

class CannotRestriction extends EffectValue {
    constructor(type, condition) {
        super();
        this.type = type;
        this.condition = condition;
    }

    getValue() {
        return this;
    }

    checkRestriction(type, abilityContext, event, effectContext) {
        if (this.type !== type) {
            return false;
        }
        if (!this.condition) {
            return true;
        }
        if (!abilityContext) {
            return false;
        }
        return this.condition(abilityContext, effectContext, event);
    }
}

export default CannotRestriction;
