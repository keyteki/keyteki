const EffectValue = require('./EffectValue');
const GainAbility = require('./GainAbility');

/**
 * Makes the target of this effect a copy of the value of this effect. Used for
 * tokens, Mirror Shell, and Mimic Gel. This doesn’t modify the card data
 * itself, but {@link Card} has code that looks for 'copyCard' effects at
 * appropriate places.
 *
 * **WARNING:** This does not un-listen any reactions or persistent effects that
 * the underlying card had in this location.
 *
 * As of PV/CC, this limitation is mitigated by the following:
 *
 * - TriggeredAbility#eventHandler takes care of ignoring reactions that are not
 *   currently in their card’s `reactions` property, which is dynamic and
 *   sensitive to CopyCard.
 * - Token creatures in general are only made from the deck or (in the case of
 *   Sidekick) the hand, so the original card’s 'play area' abilities don’t get
 *   registered in the first place.
 * - Gĕzdrutyŏ the Arcane, the only card that _becomes_ a token creature from
 *   being in play, only has an action, not persistent effects, and the code
 *   that displays the list of available actions when selecting it is sensitive
 *   to CopyCard.
 * - Mimic Gel’s persistent effect only applies to being played, so that it is
 *   still around when it’s in play isn’t relevant.
 */
class CopyCard extends EffectValue {
    /**
     * @param {Card} card Card to copy the effects from.
     * @param {boolean} copyOriginalCard If true, copies the underlying, printed
     * abilities on the card. Otherwise if the card is already copying
     * something, this would copy those abilities. Necessary for flipping token
     * creatures to their face-up side, since we need to copy those abilities,
     * not the token abilities.
     */
    constructor(card, copyOriginalCard = false) {
        super(card);
        this.abilitiesForTargets = {};

        if (card.anyEffect('copyCard') && !copyOriginalCard) {
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
            // There’s not an easy way to just get the original printed
            // actions/reactions of a card, ignoring any copyCard effects. What
            // we have to do is collect any CopyCard effects on the card, gather
            // the abilities that they’re adding, and filter those out. The
            // remaining abilities are the ones the card had initially.

            const allExistingCopyEffects = card.effects
                .filter((effect) => effect.type === 'copyCard')
                .map((staticEffect) => staticEffect.value)
                // abilitesForTargets objects have
                // actions/reactions/persistentEffects properties with array
                // values.
                .map(
                    (/** @type CopyCard */ effectValue) =>
                        effectValue.abilitiesForTargets[card.uuid] || {}
                )
                // flatmap down to the TriggeredAbility / other ability objects
                .flatMap((state) => [].concat(...Object.values(state)));

            // We explicitly want to use _e.g._ card.abilities.actions here,
            // rather than card.actions, since the latter is wired in to copy
            // card effects as well as text box blanking effects, which we do
            // _not_ want to respect for this “copy.”

            this.actions = card.abilities.actions
                .filter((effect) => !allExistingCopyEffects.includes(effect))
                .map((action) => new GainAbility('action', action, true));
            this.reactions = card.abilities.reactions
                .filter((effect) => !allExistingCopyEffects.includes(effect))
                .map((ability) => new GainAbility(ability.abilityType, ability, true));
            this.persistentEffects = card.abilities.persistentEffects
                .filter((effect) => !allExistingCopyEffects.includes(effect))
                .map((properties) => new GainAbility('persistentEffect', properties));
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
