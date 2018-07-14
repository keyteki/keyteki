const _ = require('underscore');

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

const hasDash = {
    modifyBaseMilitarySkill: card => card.hasDash('military'),
    modifyBasePoliticalSkill: card => card.hasDash('political'),
    modifyBothSkills: card => card.hasDash('military') && card.hasDash('political'),
    modifyMilitarySkill: card => card.hasDash('military'),
    modifyMilitarySkillMultiplier: card => card.hasDash('military'),
    modifyPoliticalSkill: card => card.hasDash('political'),
    modifyPoliticalSkillMultiplier: card => card.hasDash('political'),
    setBaseMilitarySkill: card => card.hasDash('military'),
    setBasePoliticalSkill: card => card.hasDash('political'),
    setDash: (card, type) => !card.hasDash(type),
    setMilitarySkill: card => card.hasDash('military'),
    setPoliticalSkill: card => !card.hasDash('political')
};

const conflictingEffects = {
    modifyBaseMilitarySkill: card => card.effects.filter(effect => effect.type === 'setBaseMilitarySkill'),
    modifyBasePoliticalSkill: card => card.effects.filter(effect => effect.type === 'setBasePoliticalSkill'),
    modifyMilitarySkill: card => card.effects.filter(effect => effect.type === 'setMilitarySkill'),
    modifyMilitarySkillMultiplier: card => card.effects.filter(effect => effect.type === 'setMilitarySkill'),
    modifyPoliticalSkill: card => card.effects.filter(effect => effect.type === 'setPoliticalSkill'),
    modifyPoliticalSkillMultiplier: card => card.effects.filter(effect => effect.type === 'setPoliticalSkill'),
    setBaseMilitarySkill: card => card.effects.filter(effect => effect.type === 'setMilitarySkill'),
    setBasePoliticalSkill: card => card.effects.filter(effect => effect.type === 'setPoliticalSkill'),
    setMaxConflicts: (player, value) =>
        player.mostRecentEffect('setMaxConflicts') === value ? [_.last(player.effects.filter(effect => effect.type === 'setMaxConflicts'))] : [],
    takeControl: (card, player) =>
        card.mostRecentEffect('takeControl') === player ? [_.last(card.effects.filter(effect => effect.type === 'takeControl'))] : []
};

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

    canBeApplied(target) {
        if(hasDash[this.type] && hasDash[this.type](target, this.value)) {
            return false;
        }
        return this.checkConflictingEffects(this.type, target);
    }

    checkConflictingEffects(type, target) {
        if(binaryCardEffects.includes(type)) {
            let matchingEffects = target.effects.filter(effect => effect.type === type);
            return matchingEffects.every(effect => this.hasLongerDuration(effect) || effect.isConditional);
        }
        if(conflictingEffects[type]) {
            let matchingEffects = conflictingEffects[type](target, this.value);
            return matchingEffects.every(effect => this.hasLongerDuration(effect) || effect.isConditional);
        }
        if(type === 'modifyBothSkills') {
            return this.checkConflictingEffects('modifyMilitarySkill', target) || this.checkConflictingEffects('modifyPoliticalSkill', target);
        }
        return true;
    }

    hasLongerDuration(effect) {
        let durations = [
            'untilEndOfDuel',
            'untilEndOfConflict',
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
