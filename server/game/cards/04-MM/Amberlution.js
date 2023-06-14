const Card = require('../../Card.js');

class Amberlution extends Card {
    // Omega.
    // Play: Destroy each creature. Each player reveals their hand and puts each creature from their hand into play ready.
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
            gameAction: ability.actions.sequential([
                ability.actions.destroy((context) => ({ target: context.game.creaturesInPlay })),
                ability.actions.sequentialPutIntoPlay((context) => ({
                    revealList: context.game.allCards.filter((card) => card.location === 'hand'),
                    forEach: context.game.allCards.filter(
                        (card) => card.location === 'hand' && card.type === 'creature'
                    ),
                    ready: true
                }))
            ])
        });
    }
}

Amberlution.id = 'æmberlution';

module.exports = Amberlution;
