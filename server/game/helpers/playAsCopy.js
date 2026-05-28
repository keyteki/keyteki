/**
 * Helper function to create effect factories for playing a card as a copy of another card
 * @param {Object} params
 * @param {Object} params.context - The ability context (context.target is the card to copy, context.source is the copying card)
 * @param {Object} params.ability - The ability object with effects
 * @param {Array} [params.additionalEffects=[]] - Additional effect factories to apply (e.g., ability.effects.changeHouse('logos'))
 * @returns {Array} Array of effect factories
 */
function buildPlayAsCopyEffects({ context, ability, additionalEffects = [] }) {
    const targetCard = context.target;

    // If no card to copy, return empty effects (can happen during hasLegalTarget checks)
    if (!targetCard) {
        return [];
    }

    const sourceCard = context.source;
    const copiedCard = targetCard.getBottomCard ? targetCard.getBottomCard() : targetCard;

    // Create custom name
    const displayName = `${sourceCard.name} as ${copiedCard.name}`;

    // Check if the copied card has alpha restriction
    const hasAlphaRestriction =
        copiedCard.hasKeyword('alpha') && !context.game.firstThingThisPhase();

    // Build the effect factories array
    let effects = [...additionalEffects];

    // For creatures, use copyCard effect with custom name
    if (sourceCard.type === 'creature') {
        const cardWrapper = Object.create(copiedCard);
        Object.defineProperty(cardWrapper, 'printedName', {
            value: displayName,
            enumerable: true
        });

        // If the card being copied is currently a creature only because of
        // lasting effects (e.g. Animator, Animating Force, Effigy of Melerukh,
        // Auto-Legionary, The Mysticeti), the copied card's printed power /
        // armor / keywords / blank state don't reflect what the copying card
        // should look like. Snapshot the relevant effective state from the
        // sources that turned the copied card into a creature and treat that
        // snapshot as the copying card's *new printed* power/armor — so that
        // external modifyPower/setPower effects (e.g. Haedroth's Wall, The
        // Pale Star) apply to the copy normally, while the original retains
        // its actual ability and obeys its setPower/modifyPower semantics.
        // Effects from third-party sources (e.g. Haedroth's Wall, Spectral
        // Tunneler) are intentionally not included in the snapshot.
        if (copiedCard.type === 'creature' && copiedCard.printedType !== 'creature') {
            // Identify sources that applied changeType('creature') to the
            // copied card.
            const transformingSources = new Set(
                copiedCard.effects
                    .filter(
                        (effect) =>
                            effect.type === 'changeType' &&
                            effect.getValue(copiedCard) === 'creature' &&
                            effect.context &&
                            effect.context.source
                    )
                    .map((effect) => effect.context.source)
            );

            const fromTransformingSource = (effect) =>
                effect.context && transformingSources.has(effect.context.source);

            const sumByType = (type) =>
                copiedCard.effects
                    .filter((effect) => effect.type === type && fromTransformingSource(effect))
                    .reduce((total, effect) => total + (effect.getValue(copiedCard) || 0), 0);

            const mostRecentByType = (type) => {
                const matching = copiedCard.effects.filter(
                    (effect) => effect.type === type && fromTransformingSource(effect)
                );
                return matching.length ? matching[matching.length - 1].getValue(copiedCard) : null;
            };

            // Compute the snapshot value the transforming source contributes.
            // setPower from the transformer wins (absolute value); otherwise
            // the snapshot is printedPower + sum of modifyPower from the
            // transformer.
            const setPower = mostRecentByType('setPower');
            const snapshotPower =
                setPower !== null
                    ? setPower
                    : (copiedCard.powerPrinted || 0) + sumByType('modifyPower');
            Object.defineProperty(cardWrapper, 'powerPrinted', {
                value: snapshotPower,
                enumerable: true
            });

            const setArmor = mostRecentByType('setArmor');
            const snapshotArmor =
                setArmor !== null
                    ? setArmor
                    : (copiedCard.armorPrinted || 0) + sumByType('modifyArmor');
            Object.defineProperty(cardWrapper, 'armorPrinted', {
                value: snapshotArmor,
                enumerable: true
            });

            // Aggregate addKeyword effects from transforming sources (e.g.
            // taunt from The Mysticeti, versatile from Animating Force).
            const aggregatedKeywords = copiedCard.effects
                .filter((effect) => effect.type === 'addKeyword' && fromTransformingSource(effect))
                .reduce((acc, effect) => {
                    const keywords = effect.getValue(copiedCard) || {};
                    for (const [keyword, count] of Object.entries(keywords)) {
                        acc[keyword] = (acc[keyword] || 0) + count;
                    }
                    return acc;
                }, {});
            if (Object.keys(aggregatedKeywords).length > 0) {
                effects.push(ability.effects.addKeyword(aggregatedKeywords));
            }

            // If a transforming source blanked the copied card's text box
            // (e.g. Effigy of Melerukh), blank the copying card too.
            const isBlankedByTransformer = copiedCard.effects.some(
                (effect) => effect.type === 'blank' && fromTransformingSource(effect)
            );
            if (isBlankedByTransformer) {
                effects.push(ability.effects.blank());
            }
        }

        effects.unshift(ability.effects.copyCard(cardWrapper));
    } else if (copiedCard && !hasAlphaRestriction) {
        // For actions, manually copy abilities and properties
        // But ONLY if not alpha-restricted (otherwise it will fizzle before abilities trigger)
        effects.push(ability.effects.modifyBonusIcons(copiedCard.bonusIcons));
        if (copiedCard.hasKeyword('omega')) {
            effects.push(ability.effects.addKeyword({ omega: 1 }));
        }
        // Treat the copying card as having the copied card's house so that
        // house-checking reactions on play (e.g. Dark Harbinger) see the
        // copied card's house rather than the copying card's printed house.
        if (copiedCard.printedHouse && copiedCard.printedHouse !== sourceCard.printedHouse) {
            effects.push(ability.effects.changeHouse(copiedCard.printedHouse));
        }
        effects = effects.concat(
            copiedCard.abilities.reactions
                .filter((a) => a.properties.name === 'Play')
                .map((playAbility) => ability.effects.gainAbility('play', playAbility.properties))
        );
    }

    // Add custom name effect
    effects.push(
        ability.effects.customDetachedCard({
            apply: (card) => {
                card._copyOriginalName = card.printedName;
                card.printedName = displayName;
            },
            unapply: (card) => {
                if (card._copyOriginalName) {
                    card.printedName = card._copyOriginalName;
                    delete card._copyOriginalName;
                }
            }
        })
    );

    // If alpha restriction applies, add location redirect effect
    if (hasAlphaRestriction) {
        effects.push(ability.effects.cardLocationAfterPlay('hand'));
    }

    return effects;
}

module.exports = { buildPlayAsCopyEffects };
