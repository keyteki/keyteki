const Card = require('../../Card.js');

class ImprintedMurmook extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyKeyCost(-1)
        });
    }
}

ImprintedMurmook.id = 'imprinted-murmook';

module.exports = ImprintedMurmook;
