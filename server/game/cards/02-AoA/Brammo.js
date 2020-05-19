const Card = require('../../Card.js');

class Brammo extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            gameAction: ability.actions.dealDamage((context) => ({
                target: context.player.opponent.creaturesInPlay.filter((card) => card.isOnFlank()),
                amount: 2
            }))
        });
    }
}

Brammo.id = 'brammo';

module.exports = Brammo;
