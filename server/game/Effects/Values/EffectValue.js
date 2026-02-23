class EffectValue {
    constructor(value) {
        this.value = value;
        if (this.value === undefined) {
            this.value = true;
        }
    }

    // eslint-disable-next-line no-unused-vars
    getValue(target, state) {
        return this.value;
    }

    // eslint-disable-next-line no-unused-vars
    apply(target, state) {}

    // eslint-disable-next-line no-unused-vars
    unapply(target, state) {}
}

export default EffectValue;
