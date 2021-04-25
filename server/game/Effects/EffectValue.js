class EffectValue {
    constructor(value) {
        this.value = value;
        if (this.value === undefined) {
            this.value = true;
        }
        this.effectContext = {};
    }

    setContext(context) {
        this.effectContext = context;
    }

    // eslint-disable-next-line no-unused-vars
    getValue(target, state) {
        if (typeof this.value === 'function') {
            return (...args) => this.value.apply(null, [...args, this.effectContext]);
        }
        return this.value;
    }

    // eslint-disable-next-line no-unused-vars
    apply(target, state) {}

    // eslint-disable-next-line no-unused-vars
    unapply(target, state) {}
}

module.exports = EffectValue;
