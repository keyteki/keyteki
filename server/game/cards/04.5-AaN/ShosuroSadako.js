const DrawCard = require('../../drawcard.js');

class ShosuroSadako extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.addGloryWhileDishonored()
        });
    }
}

ShosuroSadako.id = 'shosuro-sadako';

module.exports = ShosuroSadako;
