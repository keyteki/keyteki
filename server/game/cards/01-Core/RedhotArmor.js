const Card = require('../../Card.js');

class RedhotArmor extends Card {
    // Play: Each enemy creature with armor loses all of its armor until the end of the turn and is dealt 1D for each point of armor it lost this way.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            effect:
                "remove enemy creatures' armor and deal damage equal to the amount of armor removed",
            gameAction: ability.actions.reduceArmor((context) => ({
                target: context.player.opponent.cardsInPlay.filter((card) =>
                    card.hasToken('armor')
                ),
                amountForCard: (card) => card.tokens.armor
            })),
            then: {
                gameAction: ability.actions.dealDamage((context) => ({
                    target: context.preThenEvents
                        .filter((event) => event.amount > 0)
                        .map((event) => event.card),
                    amountForCard: (card) =>
                        context.preThenEvents.find((event) => event.card === card).amount
                }))
            }
        });
    }
}

RedhotArmor.id = 'red-hot-armor';

module.exports = RedhotArmor;
