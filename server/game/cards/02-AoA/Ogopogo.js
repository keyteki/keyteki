const Card = require('../../Card.js');

class Ogopogo extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            condition: () => this.controller.opponent.creaturesInPlay.length > 0,
            when: {
                onDamageDealt: (event, context) => event.damageSource === context.source && event.fightEvent.attacker === this && event.destroyed && context.player.opponent.creaturesInPlay.length > 0
            },
            optional: true,
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 2 })
            }
        });
    }
}

Ogopogo.id = 'ogopogo';

module.exports = Ogopogo;
