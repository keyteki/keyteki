const StaticEffect = require('./StaticEffect');

class DynamicPropertiesEffect extends StaticEffect {
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

        // Check that the properies dictionaries are equal.

        if (oldValue === this.values[target.uuid]) {
            return true;
        }
        if (oldValue === undefined || this.values[target.uuid] === undefined) {
            return false;
        }
        if (Object.keys(oldValue).length !== Object.keys(this.values[target.uuid])) {
            return false;
        }
        for (const [key, value] of Object.entries(oldValue)) {
            if (this.values[target.uuid][key] !== value) {
                return false;
            }
        }
        return true;
    }

    getValue(target) {
        if (target) {
            return this.values[target.uuid];
        }
    }
}

module.exports = DynamicPropertiesEffect;
