const Card = require('../../Card.js');

class KalochStonefather extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isInCenter(),
            match: card => card.controller === this.controller && card.type === 'creature',
            effect: ability.effects.addKeyword({ skirmish: 1 })
        });
    }
}

KalochStonefather.id = 'kaloch-stonefather';

module.exports = KalochStonefather;
