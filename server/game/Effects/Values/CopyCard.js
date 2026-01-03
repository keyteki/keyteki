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

    applyValue(target, abilities, states) {
        const result = new Array(abilities.length);
        for (var i = 0; i < abilities.length; ++i) {
            states[i] = {};
            abilities[i].apply(target, states[i]);
            result[i] = abilities[i].getValue(target, states[i]);
        }
        return result;
    }

    unapplyValue(target, abilities, states) {
        for (var i = 0; i < abilities.length; ++i) {
            abilities[i].unapply(target, states[i]);
        }
    }

    apply(target, state) {
        const states = (state[target.uuid] = {
            actions: new Array(this.actions.length),
            reactions: new Array(this.reactions.length),
            persistentEffects: new Array(this.persistentEffects.length)
        });

        this.abilitiesForTargets[target.uuid] = {
            actions: this.applyValue(target, this.actions, states.actions),
            reactions: this.applyValue(target, this.reactions, states.reactions),
            persistentEffects: this.applyValue(
                target,
                this.persistentEffects,
                states.persistentEffects
            )
        };
    }

    unapply(target, state) {
        this.unapplyValue(target, this.actions, state[target.uuid].actions);
        this.unapplyValue(target, this.reactions, state[target.uuid].reactions);
        this.unapplyValue(target, this.persistentEffects, state[target.uuid].persistentEffects);
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
