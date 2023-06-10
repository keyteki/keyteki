const Card = require('../../Card.js');

class ScrivenerFavian extends Card {
    // Enhance PTPT. (These icons have already been added to cards in your deck.)
    // When you resolve a PT bonus icon, you may choose to steal 1A instead.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.mayResolveBonusIconsAs('steal', 'capture')
        });
    }
}

ScrivenerFavian.id = 'scrivener-favian';

module.exports = ScrivenerFavian;
