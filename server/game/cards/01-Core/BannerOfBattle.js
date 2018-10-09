const Card = require('../../Card.js');

class BannerOfBattle extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.type === 'creature',
            effect: ability.effects.modifyPower(1)
        });
    }
}

BannerOfBattle.id = 'banner-of-battle'; // This is a guess at what the id might be - please check it!!!

module.exports = BannerOfBattle;
