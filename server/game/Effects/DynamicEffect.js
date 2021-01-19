const StaticEffect = require('./StaticEffect');

class DynamicEffect extends StaticEffect {
    constructor(type, calculate) {
        super(type);
        this.calculate = calculate;
    }

    apply(target) {
        super.apply(target);
        this.recalculate(target);
    }

    recalculate(target) {
        let oldValue = this.getValue(target);
        return oldValue !== this.setValue(target, this.calculate(target, this.context));
    }

    getValue(target) {
        if (target) {
            return this.state[target.uuid];
        }
    }

    setValue(target, value) {
        this.state[target.uuid] = value;
        return value;
    }
}

module.exports = DynamicEffect;
