const EffectValue = require('./EffectValue');

class GainAbility extends EffectValue {
    constructor(type, properties, printedAbility = false) {
        super();
        this.type = type;
        this.values = {};
        if(properties.properties) {
            this.properties = Object.assign({}, properties.properties, { printedAbility });
        } else {
            this.properties = Object.assign({}, properties, { printedAbility, ref: [] });
        }
    }

    getValue(target) {
        return this.values[target.uuid];
    }

    apply(target) {
        if(this.type === 'constant') {
            this.values[target.uuid] = target.constantReaction(this.properties);
        } else {
            this.values[target.uuid] = target[this.type](this.properties);
        }

        if(this.type === 'persistentEffect') {
            const value = this.values[target.uuid];
            if(value.location === 'any' || value.location === target.location) {
                value.ref = target.addEffectToEngine(value);
            }

            return;
        } else if(this.type === 'action') {
            return;
        }

        this.values[target.uuid].registerEvents();
    }

    unapply(target) {
        if(this.type === 'persistentEffect') {
            const value = this.values[target.uuid];
            if(value.ref) {
                target.removeEffectFromEngine(value.ref);
            }
        } else if(this.type !== 'action') {
            this.values[target.uuid].unregisterEvents();
        }

        delete this.values[target.uuid];
    }
}

module.exports = GainAbility;
