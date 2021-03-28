const Card = require('../../Card.js');

class PoisonWave extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'deal 2 damage to all creatures',
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 2,
                target: context.game.creaturesInPlay
            }))
        });
    }
}

PoisonWave.id = 'poison-wave';

module.exports = PoisonWave;
