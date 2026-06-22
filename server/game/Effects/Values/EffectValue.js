class EffectValue {
    constructor(value) {
        this.value = value;
        if (this.value === undefined) {
            this.value = true;
        }
    }

    getValue(target, state) {
        return this.value;
    }

    apply(target, state) {}

    unapply(target, state) {}
}

module.exports = EffectValue;
