const Card = require('../../Card.js');

class CreedOfNurture extends Card {
    // Omni: Sacrifice Creed of Nurture. If you do, reveal a creature from your hand and choose a creature in play. For the remainder of the turn, the chosen creature gains the text box of the revealed creature.
    setupCardAbilities(ability) {
        this.omni({
            gameAction: ability.actions.sacrifice(),
            then: {
                targets: {
                    creatureInHand: {
                        cardType: 'creature',
                        location: 'hand',
                        controller: 'self'
                    },
                    creatureInPlay: {
                        dependsOn: 'creatureInHand',
                        cardType: 'creature',
                        gameAction: ability.actions.cardLastingEffect((context) => {
                            const effects = context.targets.creatureInHand.traits.map((trait) =>
                                ability.effects.addTrait(trait)
                            );

                            const printedAbilities = Object.values(
                                context.targets.creatureInHand.abilities
                            ).reduce(
                                (result, array) =>
                                    result.concat(
                                        array.filter((ability) => ability.printedAbility)
                                    ),
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

                            return { effect: effects };
                        })
                    }
                },
                message: '{0} reveals {3} and choses to give its text box to {4}',
                messageArgs: (context) => [
                    context.targets.creatureInHand,
                    context.targets.creatureInPlay
                ]
            }
        });
    }
}

CreedOfNurture.id = 'creed-of-nurture';

module.exports = CreedOfNurture;
