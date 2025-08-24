const Card = require('../../Card.js');

class InfernalTerran extends Card {
    // Play/After Reap: Discard a card. Steal 1A.
    //
    // Scrap: Discard your hand. Steal A equal to the number of A
    // bonus icons on the cards discarded this way.
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            gameAction: ability.actions.sequential([
                ability.actions.discard((context) => ({
                    promptForSelect: {
                        controller: 'self',
                        location: 'hand',
                        messageArgs: (card) => [context.player, context.source, card]
                    }
                })),
                ability.actions.steal()
            ]),
            effect: 'discard a card and steal an amber'
        });

        this.scrap({
            gameAction: ability.actions.discard((context) => ({
                target: context.player.hand
            })),
            then: {
                message: '{0} uses {1} to steal {3} amber',
                messageArgs: (context) =>
                    context.preThenEvents.reduce(
                        (acc, event) =>
                            acc +
                            (event.card
                                ? event.card.bonusIcons.filter((icon) => icon === 'amber').length
                                : 0),
                        0
                    ),
                gameAction: ability.actions.steal((context) => ({
                    amount: context.preThenEvents.reduce(
                        (acc, event) =>
                            acc +
                            (event.card
                                ? event.card.bonusIcons.filter((icon) => icon === 'amber').length
                                : 0),
                        0
                    )
                }))
            }
        });
    }
}

InfernalTerran.id = 'infernal-terran';

module.exports = InfernalTerran;
