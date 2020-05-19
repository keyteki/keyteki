const EffectValue = require('./EffectValue');

const binaryCardEffects = [
    'blank',
    'canBeSeenWhenFacedown',
    'cannotParticipateAsAttacker',
    'cannotParticipateAsDefender',
    'canPlayFromOwn',
    'abilityRestrictions',
    'doesNotBow',
    'doesNotReady',
    'showTopConflictCard'
];

class StaticEffect {
    constructor(type = '', value) {
        this.type = type;
        if (value instanceof EffectValue) {
            this.value = value;
        } else {
            this.value = new EffectValue(value);
        }

        this.context = null;
        this.duration = '';
    }

    apply(target) {
        target.addEffect(this);
        this.value.apply(target);
    }

    unapply(target) {
        target.removeEffect(this);
        this.value.unapply(target);
    }

    getValue(target) {
        return this.value.getValue(target);
    }

    recalculate() {
        return false;
    }

    setContext(context) {
        this.context = context;
        this.value.setContext(context);
    }

    canBeApplied(target) {
        return this.checkConflictingEffects(this.type, target);
    }

    checkConflictingEffects(type, target) {
        if (binaryCardEffects.includes(type)) {
            let matchingEffects = target.effects.filter((effect) => effect.type === type);
            return matchingEffects.every(
                (effect) => this.hasLongerDuration(effect) || effect.isConditional
            );
        }

        return true;
    }

    hasLongerDuration(effect) {
        let durations = ['untilEndOfPhase', 'untilEndOfRound'];
        return durations.indexOf(this.duration) > durations.indexOf(effect.duration);
    }

    getDebugInfo() {
        return {
            type: this.type,
            value: this.value
        };
    }
}

module.exports = StaticEffect;
