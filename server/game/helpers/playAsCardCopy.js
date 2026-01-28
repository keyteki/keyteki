/**
 * Helper function to create effect factories for playing a card as a copy of another card
 * @param {Object} params
 * @param {Object} params.context - The ability context (context.target is the card to copy, context.source is the copying card)
 * @param {Object} params.ability - The ability object with effects
 * @param {Array} [params.additionalEffects=[]] - Additional effect factories to apply (e.g., ability.effects.changeHouse('logos'))
 * @returns {Array} Array of effect factories
 */
function buildPlayAsCopyEffects({ context, ability, additionalEffects = [] }) {
    const copiedCard = context.target;

    // If no card to copy, return empty effects (can happen during hasLegalTarget checks)
    if (!copiedCard) {
        return [];
    }

    const sourceCard = context.source;
    const bottomCard = copiedCard.getBottomCard ? copiedCard.getBottomCard() : copiedCard;

    // Create custom name
    const displayName = `${sourceCard.name} as ${bottomCard.name}`;

    // Check if the copied card has alpha restriction
    const hasAlphaRestriction =
        bottomCard.hasKeyword('alpha') && !context.game.firstThingThisPhase();

    // Build the effect factories array
    let effects = [...additionalEffects];

    // For creatures, use copyCard effect with custom name
    if (sourceCard.type === 'creature') {
        const cardWrapper = Object.create(bottomCard);
        Object.defineProperty(cardWrapper, 'printedName', {
            value: displayName,
            enumerable: true
        });
        effects.unshift(ability.effects.copyCard(cardWrapper));
    } else if (bottomCard && !hasAlphaRestriction) {
        // For actions, manually copy abilities and properties
        // But ONLY if not alpha-restricted (otherwise it will fizzle before abilities trigger)
        effects.push(ability.effects.modifyBonusIcons(bottomCard.bonusIcons));
        if (bottomCard.hasKeyword('omega')) {
            effects.push(ability.effects.addKeyword({ omega: 1 }));
        }
        effects = effects.concat(
            bottomCard.abilities.reactions
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
        if (sourceCard.type === 'creature') {
            effects.push(ability.effects.creatureCardLocationAfterPlay('hand'));
        } else {
            effects.push(ability.effects.actionCardLocationAfterPlay('hand'));
        }
    }

    return effects;
}

module.exports = { buildPlayAsCopyEffects };
