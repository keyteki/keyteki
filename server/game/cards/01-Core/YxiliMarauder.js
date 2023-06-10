const Card = require('../../Card.js');

class YxiliMarauder extends Card {
    // Yxili Marauder gets +1 power for each <A> on it.
    // Play: Capture 1<A> for each friendly ready Mars creature.
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
