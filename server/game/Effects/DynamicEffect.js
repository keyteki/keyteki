import StaticEffect from './StaticEffect.js';

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
        let newValue = this.calculate(target, this.context);
        this.values[target.uuid] = newValue;

        if (
            (typeof oldValue !== 'object' || oldValue === null) &&
            (typeof newValue !== 'object' || newValue === null)
        ) {
            return oldValue !== newValue;
        }

        if (oldValue === undefined || newValue === undefined) {
            return true;
        }
        if (Object.keys(oldValue).length !== Object.keys(newValue).length) {
            return true;
        }
        for (const [key, value] of Object.entries(oldValue)) {
            if (newValue[key] !== value) {
                return true;
            }
        }
        return false;
    }

    getValue(target) {
        if (target) {
            return this.values[target.uuid];
        }
    }
}

export default DynamicEffect;
