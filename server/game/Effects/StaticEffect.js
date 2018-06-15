class StaticEffect {
    constructor(type = '', value = true) {
        this.type = type;
        this.value = value;
        this.context = null;
    }

    apply(target) {
        target.addEffect(this);
    }

    unapply(target) {
        target.removeEffect(this);
    }

    getValue() {
        return this.value;
    }

    recalculate() {
        return false;
    }

    getDebugInfo() {
        return {
            type: this.type,
            value: this.value
        };
    }
}

module.exports = StaticEffect;
