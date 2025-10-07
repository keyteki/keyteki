import Card from '../../Card.js';

class PutInASpin extends Card {
    // Play: Lose 1A. If you do, choose a house and discard the top
    // card of your opponent’s deck. If that card belongs to the named
    // house, gain 4A.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.loseAmber((context) => ({
                target: context.player
            })),
            then: {
                condition: (context) =>
                    context.player.opponent && context.player.opponent.deck.length > 0,
                target: {
                    mode: 'house'
                },
                gameAction: ability.actions.discard((context) => ({
                    target: context.player.opponent ? context.player.opponent.deck[0] : []
                })),
                then: (preThenContext) => ({
                    condition: (context) =>
                        context.preThenEvent.card.hasHouse(preThenContext.house),
                    message: '{0} uses {1} to discard {3} and make {0} gain 4 amber',
                    messageArgs: (context) => [context.preThenEvent.card],
                    gameAction: ability.actions.gainAmber((context) => ({
                        amount: 4,
                        target: context.player
                    }))
                })
            }
        });
    }
}

PutInASpin.id = 'put-in-a-spin';

export default PutInASpin;
