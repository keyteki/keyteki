const Card = require('../../Card.js');

class Vigor extends Card {
    // Play: Heal up to 3 damage from a creature. If you healed 3 damage, gain 1<A>.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.heal({ amount: 3, upTo: true })
            },
            then: {
                condition: (context) => context.preThenEvent.amount === 3,
                message: '{0} gains an additional amber due to {1} healing 3 damage',
                gameAction: ability.actions.gainAmber()
            }
        });
    }
}

Vigor.id = 'vigor';

module.exports = Vigor;
