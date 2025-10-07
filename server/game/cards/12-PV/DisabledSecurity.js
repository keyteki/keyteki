import Card from '../../Card.js';

class DisabledSecurity extends Card {
    // Play: Discard the top 3 cards of your opponent's deck. Play 1 of the discarded cards as if it were yours.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            gameAction: ability.actions.discard((context) => ({
                target: context.player.opponent.deck.slice(0, 3)
            })),
            then: {
                target: {
                    controller: 'opponent',
                    location: 'discard',
                    cardCondition: (card, context) =>
                        context.preThenEvents
                            .filter((e) => !!e.card)
                            .map((e) => e.card)
                            .includes(card),
                    gameAction: ability.actions.playCard()
                },
                message: '{0} uses {1} to play {3}',
                messageArgs: (context) => [context.target]
            }
        });
    }
}

DisabledSecurity.id = 'disabled-security';

export default DisabledSecurity;
