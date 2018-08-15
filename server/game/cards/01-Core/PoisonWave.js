const Card = require('../../Card.js');

class PoisonWave extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'deal 2 damage to all creatures',
            gameAction: ability.actions.dealDamage(context => ({
                amount: 2,
                target: context.game.creaturesInPlay
            }))
        });
    }
}

PoisonWave.id = 'poison-wane'; // This is a guess at what the id might be - please check it!!!

module.exports = PoisonWave;
