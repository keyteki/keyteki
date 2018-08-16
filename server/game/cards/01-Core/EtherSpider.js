const Card = require('../../Card.js');

class EtherSpider extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.redirectAmber(this) // TODO
        });
    }
}

EtherSpider.id = 'ether-spider'; // This is a guess at what the id might be - please check it!!!

module.exports = EtherSpider;
