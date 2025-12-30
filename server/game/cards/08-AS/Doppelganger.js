const Card = require('../../Card.js');

class Doppelganger extends Card {
    // At the start of your turn, choose one of Doppelganger’s
    // neighbors.  For the remainder of the turn, Doppelganger gains
    // the text box of the chosen creature.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onTurnStart: (_, context) => context.player === this.game.activePlayer
            },
            // The card doesn't say this ability it optional, but 2
            // next to each other leads to an infinite loop that can't
            // otherwise be broken by the engine (but is breakable by
            // the Keyforge Infinite Loop rules).
            optional: (context) => context.source.neighbors.some((c) => c.hasTrait('shapeshifter')),
            target: {
                cardCondition: (card, context) => context.source.neighbors.includes(card),
                gameAction: ability.actions.cardLastingEffect((context) => {
                    const effects = context.target.traits.map((trait) =>
                        ability.effects.addTrait(trait)
                    );

                    // Pull the abilities from the
                    // actions/reactions/persistentEffects properties because
                    // they’re sensitive to the CopyCard effect (used for token
                    // creatures).
                    const printedAbilities = [
                        context.target.actions,
                        context.target.reactions,
                        context.target.persistentEffects
                    ].reduce(
                        (result, array) =>
                            result.concat(array.filter((ability) => ability.printedAbility)),
                        []
                    );
                    for (const printedAbility of printedAbilities) {
                        effects.push(
                            ability.effects.gainAbility(
                                printedAbility.abilityType,
                                printedAbility.properties
                                    ? printedAbility.properties
                                    : printedAbility
                            )
                        );
                    }

                    return {
                        target: context.source,
                        effect: effects
                    };
                })
            },
            message: '{0} uses {1} to give {1} the text box of {2} for the remainder of the turn',
            messageArgs: (context) => [context.player, context.source, context.target]
        });
    }
}

Doppelganger.id = 'doppelganger';

module.exports = Doppelganger;
