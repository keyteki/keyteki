const Card = require('../../Card.js');

class GreaterOxtet extends Card {
    // Taunt.
    // At the end of your ready cards step, purge a card from your hand. If you do, give Greater Oxtet two +1 power counters.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onPhaseEnded: (event, context) =>
                    event.phase === 'ready' && this.game.activePlayer === context.player
            },
            target: {
                controller: 'self',
                location: 'hand',
                gameAction: ability.actions.purge()
            },
            then: {
                gameAction: ability.actions.addPowerCounter({ amount: 2 })
            }
        });
    }
}

GreaterOxtet.id = 'greater-oxtet';

module.exports = GreaterOxtet;
