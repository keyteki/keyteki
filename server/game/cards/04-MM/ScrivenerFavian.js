const Card = require('../../Card.js');

class ScrivenerFavian extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.mayResolveBonusIconsAs('steal', 'capture')
        });
    }
}

ScrivenerFavian.id = 'scrivener-favian';

module.exports = ScrivenerFavian;
