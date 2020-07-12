const Card = require('../../Card.js');

class Amberlution extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect:
                "destroy each creature; reveal {1}'s hand as {2}; and reveal {3}'s hand as {4} and put creatures from each player's hand into play ready",
            effectArgs: (context) => [
                context.player,
                context.player.hand,
                context.player.opponent,
                context.player.opponent ? context.player.opponent.hand : []
            ],
            gameAction: [
                ability.actions.destroy((context) => ({ target: context.game.creaturesInPlay })),
                ability.actions.sequentialForEach((context) => ({
                    forEach: context.game.allCards.filter(
                        (card) => card.location === 'hand' && card.type === 'creature'
                    ),
                    action: ability.actions.sequential([
                        ability.actions.putIntoPlay(),
                        ability.actions.ready()
                    ])
                }))
            ]
        });
    }
}

Amberlution.id = 'æmberlution';

module.exports = Amberlution;
