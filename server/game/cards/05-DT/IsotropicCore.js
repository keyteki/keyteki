const Card = require('../../Card.js');

class IsotropicCore extends Card {
    //Each friendly creature gains Hazardous 1.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.type === 'creature',
            effect: ability.effects.addKeyword({
                hazardous: 1
            })
        });
    }
}

IsotropicCore.id = 'isotropic-core';

module.exports = IsotropicCore;
