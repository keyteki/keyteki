const EffectValue = require('./EffectValue');
const GainAbility = require('./GainAbility');

class CopyCard extends EffectValue {
    constructor(card, cascadeEffects = true) {
        super(card);
        this.abilitiesForTargets = {};
        if (cascadeEffects && card.anyEffect('copyCard')) {
            this.value = card.mostRecentEffect('copyCard');
            this.actions = this.value.actions.map(
                (action) => new GainAbility('action', action, true)
            );
            this.reactions = this.value.reactions.map(
                (ability) => new GainAbility(ability.abilityType, ability, true)
            );
            this.persistentEffects = this.value.persistentEffects.map(
                (properties) => new GainAbility('persistentEffect', properties)
            );
        } else {
            this.actions = card.abilities.actions.map(
                (action) => new GainAbility('action', action, true)
            );
            this.reactions = card.abilities.reactions.map(
                (ability) => new GainAbility(ability.abilityType, ability, true)
            );
            this.persistentEffects = card.abilities.persistentEffects.map(
                (properties) => new GainAbility('persistentEffect', properties)
            );
        }
    }

    apply(target, state) {
        this.abilitiesForTargets[target.uuid] = {
            actions: this.actions.map((value) => {
                value.apply(target, state);
                return value.getValue(target, state);
            }),
            reactions: this.reactions.map((value) => {
                value.apply(target, state);
                return value.getValue(target, state);
            }),
            persistentEffects: this.persistentEffects.map((value) => {
                value.apply(target, state);
                return value.getValue(target, state);
            })
        };
    }

    unapply(target) {
        for (const value of this.abilitiesForTargets[target.uuid].reactions) {
            target.removeAbility(value);
            value.unregisterEvents();
        }

        for (const effect of this.persistentEffects) {
            if (effect.ref) {
                target.removeEffectFromEngine(effect.ref);
                effect.ref = [];
            }
        }

        delete this.abilitiesForTargets[target.uuid];
    }

    getActions(target) {
        if (this.abilitiesForTargets[target.uuid]) {
            return this.abilitiesForTargets[target.uuid].actions;
        }

        return [];
    }

    getReactions(target) {
        if (this.abilitiesForTargets[target.uuid]) {
            return this.abilitiesForTargets[target.uuid].reactions;
        }

        return [];
    }

    getPersistentEffects(target) {
        if (this.abilitiesForTargets[target.uuid]) {
            return this.abilitiesForTargets[target.uuid].persistentEffects;
        }

        return [];
    }
}

module.exports = CopyCard;
