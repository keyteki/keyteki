const Card = require('../../Card.js');

class Molephin extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onStealAmber: (event, context) => event.player === context.player
            },
            gameAction: ability.actions.dealDamage((context) => ({
                target: context.player.opponent.creaturesInPlay,
                amount: context.event.amount
            }))
        });
    }
}

Molephin.id = 'molephin';

module.exports = Molephin;
