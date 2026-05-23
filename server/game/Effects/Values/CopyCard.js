const EffectValue = require('./EffectValue');
const GainAbility = require('./GainAbility');

/**
 * Makes the target of this effect a copy of the given card. Used for tokens,
 * Mirror Shell, and Mimic Gel. This does not modify the card data itself;
 * {@link Card} consults `copyCard` effects at the appropriate places.
 *
 * When `cascadeEffects` is true (the default) and the source is itself
 * currently copying another card, we chain through to that copy's abilities so
 * a copy-of-a-copy resolves to the original. Otherwise we copy the source's
 * own printed abilities, filtering out any abilities that were themselves
 * injected by a `copyCard` effect on the source — without this, un-tokenizing
 * (or copying a card that is being copied) would re-inject the same abilities.
 *
 * Concrete example: a token creature has been Mirror Shelled to become a copy
 * of creature X. If something then makes a new copy of that token creature,
 * the new copy should resolve to X's abilities (via the cascade), but not
 * inherit the Mirror Shell `copyCard` effect itself — otherwise the new copy
 * would carry its own copy-of-X layer, compounding on every subsequent copy.
 */
class CopyCard extends EffectValue {
    constructor(card, cascadeEffects = true) {
        super(card);
        this.abilitiesForTargets = {};
        if (cascadeEffects && card.anyEffect('copyCard')) {
            this.value = card.mostRecentEffect('copyCard');
            // Pull from `abilities.*` (printed-only) rather than the card's
            // `actions`/`reactions`/`persistentEffects` getters, which also
            // include abilities granted to the intermediate card by upgrades.
            // Matches the printed-only behavior of the non-cascading branch.
            this.actions = this.value.abilities.actions.map(
                (action) => new GainAbility('action', action, true)
            );
            this.reactions = this.value.abilities.reactions.map(
                (ability) => new GainAbility(ability.abilityType, ability, true)
            );
            this.persistentEffects = this.value.abilities.persistentEffects.map(
                (properties) => new GainAbility('persistentEffect', properties)
            );
        } else {
            // Filter out abilities previously injected by other copyCard
            // effects so we copy only the card's own printed abilities
            // (e.g. when un-tokenizing back to the underlying card).
            const existingCopiedAbilities = card.effects
                .filter((effect) => effect.type === 'copyCard')
                .map((effect) => effect.value.abilitiesForTargets[card.uuid] || {})
                .flatMap((state) => [].concat(...Object.values(state)));

            this.actions = card.abilities.actions
                .filter((action) => !existingCopiedAbilities.includes(action))
                .map((action) => new GainAbility('action', action, true));
            this.reactions = card.abilities.reactions
                .filter((ability) => !existingCopiedAbilities.includes(ability))
                .map((ability) => new GainAbility(ability.abilityType, ability, true));
            this.persistentEffects = card.abilities.persistentEffects
                .filter((properties) => !existingCopiedAbilities.includes(properties))
                .map((properties) => new GainAbility('persistentEffect', properties));
        }
    }

    applyValue(target, abilities, states, context) {
        const result = new Array(abilities.length);
        for (var i = 0; i < abilities.length; ++i) {
            states[i] = {};
            abilities[i].apply(target, states[i], context);
            result[i] = abilities[i].getValue(target, states[i]);
        }
        return result;
    }

    unapplyValue(target, abilities, states) {
        for (var i = 0; i < abilities.length; ++i) {
            abilities[i].unapply(target, states[i]);
        }
    }

    apply(target, state, context) {
        const states = (state[target.uuid] = {
            actions: new Array(this.actions.length),
            reactions: new Array(this.reactions.length),
            persistentEffects: new Array(this.persistentEffects.length)
        });

        this.abilitiesForTargets[target.uuid] = {
            actions: this.applyValue(target, this.actions, states.actions, context),
            reactions: this.applyValue(target, this.reactions, states.reactions, context),
            persistentEffects: this.applyValue(
                target,
                this.persistentEffects,
                states.persistentEffects,
                context
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
