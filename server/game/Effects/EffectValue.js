class EffectValue {
    constructor(value) {
        this.value = value;
        if (this.value === undefined) {
            this.value = true;
        }

        this.context = {};
    }

    setValue(value) {
        this.value = value;
    }

    // eslint-disable-next-line no-unused-vars
    getValue(target) {
        return this.value;
    }

    setContext(context) {
        this.context = context;
    }

    // eslint-disable-next-line no-unused-vars
    apply(target) {}

    // eslint-disable-next-line no-unused-vars
    unapply(target) {}
}

module.exports = EffectValue;
