const EffectValue = require('./EffectValue');

class GainAbility extends EffectValue {
    constructor(type, properties, printedAbility = false) {
        super();
        this.type = type;
        if (properties.properties) {
            this.properties = Object.assign({}, properties.properties, { printedAbility });
        } else {
            this.properties = Object.assign({}, properties, { printedAbility, ref: [] });
        }
        if (this.type === 'omni') {
            this.type = 'action';
            this.properties.omni = true;
        }
    }

    getValue(target, state) {
        return state[target.uuid];
    }

    apply(target, state) {
        state[target.uuid] = target[this.type](this.properties);

        if (this.type === 'persistentEffect') {
            const value = state[target.uuid];
            if (value.location === 'any' || value.location === target.location) {
                value.ref = target.addEffectToEngine(value);
            }

            return;
        } else if (this.type === 'action') {
            return;
        }

        state[target.uuid].registerEvents();
    }

    unapply(target, state) {
        if (this.type === 'persistentEffect') {
            const value = state[target.uuid];
            if (value.ref) {
                target.removeEffectFromEngine(value.ref);
            }
        } else if (this.type !== 'action') {
            state[target.uuid].unregisterEvents();
        }

        delete state[target.uuid];
    }
}

module.exports = GainAbility;
