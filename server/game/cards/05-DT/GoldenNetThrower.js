const Card = require('../../Card.js');

class GoldenNetThrower extends Card {
    //Enhance PTPT.
    //Reap: Exhaust a creature.
    setupCardAbilities(ability) {
        //Keywords: enhance
        this.reap({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.exhaust()
            }
        });
    }
}

GoldenNetThrower.id = 'golden-net-thrower';

module.exports = GoldenNetThrower;
