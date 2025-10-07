import Card from '../../Card.js';

function getHouse(context) {
    return context.secondResolution ? context.secondResolution : context.house;
}

class HighStreetChurn extends Card {
    // Play: Choose a house on your opponent’s identity card. Your
    // opponent discards a random card from their hand until they
    // discard a card of the chosen house or run out of cards. They
    // refill their hand as if it were their “draw cards” step.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            target: {
                mode: 'house',
                houses: (context) =>
                    context.secondResolution ? [] : context.player.opponent.houses
            },
            gameAction: ability.actions.discardAtRandom((context) => ({
                target: context.player.opponent,
                amount: 1
            })),
            then: (preThenContext) => ({
                alwaysTriggers: true,
                gameAction: ability.actions.conditional((context) => ({
                    condition:
                        !context.preThenEvent ||
                        !context.preThenEvent.cards ||
                        context.preThenEvent.cards.length === 0 ||
                        context.preThenEvent.cards[0].hasHouse(getHouse(preThenContext)) ||
                        context.player.opponent.hand.length === 0,
                    trueGameAction: ability.actions.draw((context) => ({
                        target: context.player.opponent,
                        refill: true
                    })),
                    falseGameAction: ability.actions.resolveAbility({
                        ability: preThenContext.ability,
                        secondResolution: getHouse(preThenContext)
                    })
                }))
            })
        });
    }
}

HighStreetChurn.id = 'high-street-churn';

export default HighStreetChurn;
