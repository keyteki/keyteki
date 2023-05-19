const Card = require('../../Card.js');

class IrradiatedAmber extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.player.opponent && context.player.opponent.amber >= 6,
            effect: 'deal 3 damage to all enemy creatures',
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 3,
                target: context.player.opponent.creaturesInPlay
            }))
        });
    }
}

IrradiatedAmber.id = 'irradiated-æmber';

module.exports = IrradiatedAmber;
