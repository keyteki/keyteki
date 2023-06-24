const EffectValue = require('./Values/EffectValue');

class StaticEffect {
    constructor(type = '', value) {
        this.type = type;
        if (value instanceof EffectValue) {
            this.value = value;
        } else {
            this.value = new EffectValue(value);
        }
        this.state = {};
        this.context = null;
    }

    apply(target) {
        target.addEffect(this);
        this.value.apply(target, this.state);
    }

    unapply(target) {
        target.removeEffect(this);
        this.value.unapply(target, this.state);
    }

    getValue(target) {
        return this.value.getValue(target, this.state);
    }

    recalculate() {
        return false;
    }

    setContext(context) {
        this.context = context;
    }

    getDebugInfo() {
        return {
            type: this.type,
            value: this.value,
            state: this.state
        };
    }
}

module.exports = StaticEffect;
