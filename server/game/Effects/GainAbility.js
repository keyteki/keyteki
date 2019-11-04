const EffectValue = require('./EffectValue');

class GainAbility extends EffectValue {
    constructor(properties) {
        super();
        this.abilityType = properties.abilityType;
        this.properties = properties;
        if(properties.properties) {
            this.properties = Object.assign({}, properties.properties, { printedAbility: false });
        }
    }

    apply(target) {
        if(this.abilityType === 'persistent') {
            this.value = this.properties;
            return;
        } else if(this.abilityType === 'action') {
            this.value = target.createAction(this.properties);
        } else {
            this.value = target.createTriggeredAbility(this.abilityType, this.properties);
            this.value.registerEvents();
        }
    }

    unapply() {
        if(this.abilityType === 'persistent' || this.abilityType === 'action') {
            return;
        }

        this.value.unregisterEvents();
    }
}

module.exports = GainAbility;
