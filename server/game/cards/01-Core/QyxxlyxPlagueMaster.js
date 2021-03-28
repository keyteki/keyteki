const Card = require('../../Card.js');

class QyxxlyxPlagueMaster extends Card {
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 3,
                ignoreArmor: true,
                target: context.game.creaturesInPlay.filter((card) => card.hasTrait('human'))
            }))
        });
    }
}

QyxxlyxPlagueMaster.id = 'qyxxlyx-plague-master';

module.exports = QyxxlyxPlagueMaster;
