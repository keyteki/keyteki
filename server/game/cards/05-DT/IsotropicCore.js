import Card from '../../Card.js';

class IsotropicCore extends Card {
    // Each friendly creature gains hazardous 1.  (Before that creature is attacked, deal 1D to the attacking enemy.)
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

export default IsotropicCore;
