const Card = require('../../Card.js');

class KalochStonefather extends Card {
    // While Kaloch Stonefather is in the center of your battleline, each friendly creature gains skirmish.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.isInCenter(),
            match: (card) => card.type === 'creature',
            effect: ability.effects.addKeyword({ skirmish: 1 })
        });
    }
}

KalochStonefather.id = 'kaloch-stonefather';

module.exports = KalochStonefather;
