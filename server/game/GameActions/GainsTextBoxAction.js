const { EVENTS } = require('../Events/types');
const Effects = require('../effects');
const CardGameAction = require('./CardGameAction');

/**
 * Gives the target card the text box of `textBoxSource` for the configured
 * duration (defaults to until end of the current player's turn). "Text box"
 * is interpreted as the text box-source card's current effective traits,
 * keywords, and abilities (actions, reactions, persistent effects),
 * including those granted by upgrades, prior gainsTextBox effects, or
 * CopyCard (e.g. token creatures). It does NOT copy stat modifications
 * such as +power or +armor that an upgrade "gets" the wearer.
 *
 * Resolutions record `context.source` in
 * `game.gainsTextBoxSourcesThisPhase` so callers can detect recurring loops
 * (e.g. two Doppelgangers next to each other) within the current timing
 * window and offer the KeyForge infinite-loop escape: remove the looping
 * card from play. The tracking is phase-scoped (reset in
 * `Game.resetThingsThisPhase`) so a fresh phase starts with a clean slate
 * and the escape is only offered on a re-resolution within the same
 * window.
 */
class GainsTextBoxAction extends CardGameAction {
    /**
     * Static infinite-loop predicate consumed by `AbilityTargetCard`. The
     * loop is detected when the ability source has already resolved a
     * gains-text-box at least once in the current phase (so this is a
     * recurring resolution within the same timing window) and at least one
     * legal target of the prompt would also propagate a gains-text-box
     * ability — i.e. picking it would let the loop continue indefinitely.
     */
    static isInfiniteLoop(context, legalTargets) {
        return (
            context.game.gainsTextBoxSourcesThisPhase.includes(context.source) &&
            legalTargets.some((card) => card.hasGainsTextBoxAbility())
        );
    }

    setDefaultProperties() {
        this.textBoxSource = null;
        this.duration = 'untilPlayerTurnEnd';
        this.until = null;
        this.condition = null;
        this.allowedLocations = ['play area'];
    }

    setup() {
        super.setup();
        this.targetType = ['creature', 'artifact', 'upgrade'];
        this.name = 'gainsTextBox';
        this.effectMsg = 'have {0} gain the text box of a creature';
    }

    canAffect(card, context) {
        if (!this.textBoxSource || this.textBoxSource.location !== 'play area') {
            return false;
        }
        if (this.allowedLocations !== 'any' && !this.allowedLocations.includes(card.location)) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEffectMessage() {
        return ['have {0} gain the text box of {1}', [this.target[0], this.textBoxSource]];
    }

    buildEffectFactories(textBoxSource) {
        const factories = [];

        for (const trait of textBoxSource.getTraits()) {
            factories.push(Effects.addTrait(trait));
        }

        // Aggregate all keywords currently active on the text box source
        // (printed plus those granted by upgrades or other gain-style
        // effects) by merging every `addKeyword` effect that applies to it.
        const keywordTotals = {};
        for (const keywords of textBoxSource.getEffects('addKeyword')) {
            for (const [keyword, count] of Object.entries(keywords)) {
                if (typeof count === 'number' && count > 0) {
                    keywordTotals[keyword] = (keywordTotals[keyword] || 0) + count;
                }
            }
        }
        if (Object.keys(keywordTotals).length > 0) {
            factories.push(Effects.addKeyword(keywordTotals));
        }

        // Use the runtime ability accessors so we pick up CopyCard-base
        // abilities (token creatures, Mimic Gel) and abilities the source has gained
        // via upgrades or earlier gainsTextBox effects.
        const sourceAbilities = [
            ...textBoxSource.actions,
            ...textBoxSource.reactions,
            ...textBoxSource.persistentEffects
        ];
        for (const sourceAbility of sourceAbilities) {
            const abilityType = sourceAbility.abilityType;
            if (!abilityType) continue;
            const properties = sourceAbility.properties ? sourceAbility.properties : sourceAbility;
            factories.push(Effects.gainAbility(abilityType, properties));
        }

        return factories;
    }

    getEvent(card, context) {
        const textBoxSource = this.textBoxSource;
        const duration = this.until ? 'lastingEffect' : this.duration;
        const effectFactories = this.buildEffectFactories(textBoxSource);
        const condition = this.condition;
        const until = this.until;

        return super.createEvent(
            EVENTS.onEffectApplied,
            { card: card, context: context },
            (event) => {
                const properties = {
                    condition: condition,
                    context: event.context,
                    effect: effectFactories,
                    effectController: event.context.player,
                    match: card,
                    until: until
                };
                event.context.source[duration](() => properties);
                event.context.game.gainsTextBoxSourcesThisPhase.push(event.context.source);
            }
        );
    }
}

module.exports = GainsTextBoxAction;
