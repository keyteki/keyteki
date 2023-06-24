const Card = require('../../Card.js');

class AmmoniaClouds extends Card {
    // Play: Deal 3<D> to each creature.
    setupCardAbilities(ability) {
        this.play({
            effect: 'deal 3 damage to all creatures',
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 3,
                target: context.game.creaturesInPlay
            }))
        });
    }
}

AmmoniaClouds.id = 'ammonia-clouds';

module.exports = AmmoniaClouds;
