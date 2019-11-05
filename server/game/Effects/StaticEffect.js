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
    constructor(type = '', value = true) {
        this.type = type;
        this.value = value;
        this.context = null;
        this.duration = '';
    }

    apply(target) {
        target.addEffect(this);
    }

    unapply(target) {
        target.removeEffect(this);
    }

    getValue() {
        return this.value;
    }

    recalculate() {
        return false;
    }

    setContext(context) {
        this.context = context;
        if(typeof this.value === 'object') {
            this.value.context = context;
        }
    }

    canBeApplied(target) {
        return this.checkConflictingEffects(this.type, target);
    }

    checkConflictingEffects(type, target) {
        if(binaryCardEffects.includes(type)) {
            let matchingEffects = target.effects.filter(effect => effect.type === type);
            return matchingEffects.every(effect => this.hasLongerDuration(effect) || effect.isConditional);
        }

        return true;
    }

    hasLongerDuration(effect) {
        let durations = [
            'untilEndOfPhase',
            'untilEndOfRound'
        ];
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
