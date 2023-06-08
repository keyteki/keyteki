const Card = require('../../Card.js');

class EtherSpider extends Card {
    // Ether Spider deals no damage when fighting.
    // Each <A> that would be added to your opponents pool is captured by Ether Spider instead.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.redirectAmber((_, context) => context.source)
        });

        this.persistentEffect({
            effect: ability.effects.cardCannot('dealFightDamage')
        });
    }
}

EtherSpider.id = 'ether-spider';

module.exports = EtherSpider;
