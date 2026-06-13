const { EVENTS } = require('../Events/types');
const Effects = require('../effects');
const CardGameAction = require('./CardGameAction');

/**
 * Returns true if the given persistent-effect factory produces an
 * `addKeyword` effect. Persistent-effect `effect` properties are factory
 * functions of shape `(game, source, props) => CardEffect` produced by
 * `EffectBuilder`. We invoke the factory with stub arguments (supplying
 * an empty `context` so the Effect constructor doesn't try to derive one
 * from `game`) so we can inspect the resulting effect's type.
 */
function isAddKeywordEffectFactory(factory) {
    if (typeof factory !== 'function') {
        return false;
    }
    try {
        const inst = factory(null, null, { context: {} });
        return !!(inst && inst.effect && inst.effect.type === 'addKeyword');
    } catch (e) {
        return false;
    }
}

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
        // (printed plus those granted by upgrades or external auras) by
        // merging every `addKeyword` effect that applies to it. Keywords
        // reduce cleanly to numeric values, so we collapse them here
        // rather than cloning each underlying ability — that also picks
        // up keywords granted by effects that don't live in the source's
        // own `persistentEffects` (e.g. an upgrade attached to it).
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

        // Re-emit the source's own abilities on the target. Unlike
        // keywords, non-keyword persistent effects can't be collapsed to
        // values — they have match conditions, durations, and side
        // effects on other cards (e.g. a creature whose persistent
        // effect grants skirmish to every other creature in play). The
        // target has to gain the whole ability definition so it acts as
        // the new source. Includes CopyCard-base abilities (token
        // creatures, Mimic Gel) and abilities the source itself gained
        // via upgrades or earlier gainsTextBox effects.
        //
        // We pull from the `reactions`/`persistentEffects` getters (so
        // CopyCard cascades and gainAbility effects are included), but
        // explicitly drop entries that come from the engine-defined
        // `keywordReactions` / `keywordPersistentEffects` buckets
        // (Assault, Hazardous, Warded, Taunt, Enraged, …). Those are
        // installed on every Card via `setupKeywordAbilities` and read
        // their numeric trigger from the card's current keyword totals
        // — which we already convey through the `addKeyword`
        // aggregation above. Re-emitting them as `gainAbility` effects
        // would make fight-related keyword damage resolve twice
        // (target's own copy + the gained copy).
        const keywordReactionSet = new Set(textBoxSource.abilities.keywordReactions);
        const keywordPersistentEffectSet = new Set(
            textBoxSource.abilities.keywordPersistentEffects
        );
        const sourceAbilities = [
            ...textBoxSource.actions,
            ...textBoxSource.reactions.filter((reaction) => !keywordReactionSet.has(reaction)),
            ...textBoxSource.persistentEffects.filter(
                (persistentEffect) => !keywordPersistentEffectSet.has(persistentEffect)
            )
        ];
        for (const sourceAbility of sourceAbilities) {
            const abilityType = sourceAbility.abilityType;
            if (!abilityType) {
                continue;
            }
            const properties = sourceAbility.properties ? sourceAbility.properties : sourceAbility;
            if (abilityType === 'persistentEffect') {
                // Printed keywords also live in `persistentEffects` as
                // addKeyword effects, but the aggregation above already
                // accounted for them. Drop those factories here so we
                // don't apply the same keyword a second time (which
                // would double numeric values like hazardous, assault,
                // poison).
                const effProp = properties.effect;
                const factoriesList = Array.isArray(effProp) ? effProp : effProp ? [effProp] : [];
                const filteredFactories = factoriesList.filter(
                    (factory) => !isAddKeywordEffectFactory(factory)
                );
                if (filteredFactories.length === 0) {
                    continue;
                }
                if (filteredFactories.length !== factoriesList.length) {
                    factories.push(
                        Effects.gainAbility(abilityType, {
                            ...properties,
                            effect: filteredFactories
                        })
                    );
                    continue;
                }
            }
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
