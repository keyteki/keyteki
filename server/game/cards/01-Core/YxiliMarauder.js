const Card = require('../../Card.js');

class YxiliMarauder extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyPower((card) => card.amber)
        });

        this.play({
            gameAction: ability.actions.capture((context) => ({
                amount: context.player.creaturesInPlay.filter(
                    (card) => card.hasHouse('mars') && !card.exhausted
                ).length
            }))
        });
    }
}

YxiliMarauder.id = 'yxili-marauder';

module.exports = YxiliMarauder;
