import Card from '../../Card.js';

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
                messageArgs: (context) => {
                    const events = context.preThenEvents || [];
                    const cards = events.flatMap((e) =>
                        (Array.isArray(e.cards) ? e.cards : []).concat(e.card ? [e.card] : [])
                    );
                    return cards.reduce(
                        (acc, card) =>
                            acc + card.bonusIcons.filter((icon) => icon === 'amber').length,
                        0
                    );
                },
                gameAction: ability.actions.steal((context) => {
                    const events = context.preThenEvents || [];
                    const cards = events.flatMap((e) =>
                        (Array.isArray(e.cards) ? e.cards : []).concat(e.card ? [e.card] : [])
                    );
                    const amount = cards.reduce(
                        (acc, card) =>
                            acc + card.bonusIcons.filter((icon) => icon === 'amber').length,
                        0
                    );
                    return { amount };
                })
            }
        });
    }
}

InfernalTerran.id = 'infernal-terran';

export default InfernalTerran;
