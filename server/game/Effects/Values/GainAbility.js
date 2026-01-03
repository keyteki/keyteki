const EffectValue = require('./EffectValue');

class GainAbility extends EffectValue {
    constructor(type, properties, printedAbility = false) {
        super();
        this.type = type;
        this.printedAbility = printedAbility;
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

    apply(target, state, context) {
        const value = (state[target.uuid] = target[this.type](this.properties));
        // Store the source that granted this ability for later identification
        if (context && context.source) {
            value.grantedBy = context.source;
        }
        if (this.type === 'persistentEffect') {
            if (value.location === 'any' || value.location === target.location) {
                value.ref = target.addEffectToEngine(value);
            }
        } else if (this.type !== 'action') {
            value.registerEvents();
        }
    }

    unapply(target, state) {
        const value = state[target.uuid];
        if (this.type === 'persistentEffect') {
            if (value.ref) {
                target.removeEffectFromEngine(value.ref);
            }
        } else if (this.type !== 'action') {
            value.unregisterEvents();
        }
        if (this.printedAbility) {
            target.removeAbility(value);
        }

        delete state[target.uuid];
    }
}

module.exports = GainAbility;
