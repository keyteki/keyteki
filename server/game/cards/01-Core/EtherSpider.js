const Card = require('../../Card.js');

class EtherSpider extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.redirectAmber(this)
        });

        this.persistentEffect({
            effect: ability.effects.cardCannot('dealFightDamage')
        });
    }
}

EtherSpider.id = 'ether-spider';

module.exports = EtherSpider;
