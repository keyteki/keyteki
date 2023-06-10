const Card = require('../../Card.js');

class BannerOfBattle extends Card {
    // Each friendly creature gets +1 power.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.type === 'creature',
            effect: ability.effects.modifyPower(1)
        });
    }
}

BannerOfBattle.id = 'banner-of-battle';

module.exports = BannerOfBattle;
