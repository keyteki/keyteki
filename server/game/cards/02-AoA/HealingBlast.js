const Card = require('../../Card.js');

class HealingBlast extends Card {
    // Play: Fully heal a creature. If you healed 4 or more damage this way, gain 2A.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.heal({ fully: true, upTo: true })
            },
            then: {
                condition: (context) => context.preThenEvent.amount >= 4,
                message: '{0} gains an additional 2 amber due to {1} healing 4 or more damage',
                gameAction: ability.actions.gainAmber({ amount: 2 })
            }
        });
    }
}

HealingBlast.id = 'healing-blast';

module.exports = HealingBlast;
