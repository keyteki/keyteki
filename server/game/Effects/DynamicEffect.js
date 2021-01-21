const StaticEffect = require('./StaticEffect');

class DynamicEffect extends StaticEffect {
    constructor(type, calculate) {
        super(type);
        this.values = {};
        this.calculate = calculate;
    }

    apply(target) {
        super.apply(target);
        this.recalculate(target);
    }

    recalculate(target) {
        let oldValue = this.getValue(target);
        this.values[target.uuid] = this.calculate(target, this.context);
        return oldValue !== this.values[target.uuid];
    }

    getValue(target) {
        if (target) {
            return this.values[target.uuid];
        }
    }
}

module.exports = DynamicEffect;
