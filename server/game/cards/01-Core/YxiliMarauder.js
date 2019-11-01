const Card = require('../../Card.js');

class YxiliMarauder extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.modifyPower(() => this.amber)
        });

        this.play({
            gameAction: ability.actions.capture(context => ({
                amount: context.player.creaturesInPlay.filter(card => card.hasHouse('mars') && !card.exhausted).length
            }))
        });
    }
}

YxiliMarauder.id = 'yxili-marauder';

module.exports = YxiliMarauder;
