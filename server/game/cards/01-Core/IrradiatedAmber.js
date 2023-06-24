const Card = require('../../Card.js');

class IrradiatedAmber extends Card {
    // Play: If your opponent has 6<A> or more, deal 3<D> to each enemy creature.
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
