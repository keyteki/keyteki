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

    match(type, abilityContext, event) {
        if (this.type !== type) {
            return false;
        }
        if (!this.condition) {
            return true;
        }
        if (!abilityContext) {
            return false;
        }
        return this.condition(abilityContext, this.effectContext, event);
    }
}

module.exports = CannotRestriction;
