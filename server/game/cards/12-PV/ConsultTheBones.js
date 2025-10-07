import Card from '../../Card.js';

class ConsultTheBones extends Card {
    // Play: Discard the top card of each player's deck. For each card
    // discarded this way, resolve its bonus icons as if you had played it.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.discard((context) => ({
                target: [context.player.deck.length > 0 ? context.player.deck[0] : []].concat(
                    context.player.opponent && context.player.opponent.deck.length > 0
                        ? context.player.opponent.deck[0]
                        : []
                )
            })),
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.resolveBonusIcons((context) => ({
                    target: context.preThenEvents
                        .filter((event) => event.card)
                        .map((event) => event.card)
                }))
            }
        });
    }
}

ConsultTheBones.id = 'consult-the-bones';

export default ConsultTheBones;
