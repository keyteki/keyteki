const _ = require('underscore');

const EffectValue = require('./EffectValue');
const GainAbility = require('./GainAbility');

class CopyCard extends EffectValue {
    constructor(card) {
        super(card);
        this.abilitiesForTargets = {};
        if (card.anyEffect('copyCard')) {
            this.value = card.mostRecentEffect('copyCard');
            const copyEffect = _.last(card.effects.filter((effect) => effect.type === 'copyCard'));
            this.actions = copyEffect.actions.map(
                (action) => new GainAbility('action', action, true)
            );
            this.reactions = copyEffect.reactions.map(
                (ability) => new GainAbility(ability.abilityType, ability, true)
            );
            this.persistentEffects = copyEffect.persistentEffects.map(
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

    apply(target) {
        this.abilitiesForTargets[target.uuid] = {
            actions: this.actions.map((value) => {
                value.apply(target);
                return value.getValue(target);
            }),
            reactions: this.reactions.map((value) => {
                value.apply(target);
                return value.getValue(target);
            }),
            persistentEffects: this.persistentEffects.map((value) => {
                value.apply(target);
                return value.getValue(target);
            })
        };
    }

    unapply(target) {
        for (const value of this.abilitiesForTargets[target.uuid].reactions) {
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
