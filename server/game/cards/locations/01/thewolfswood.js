const DrawCard = require('../../../drawcard.js');

class TheWolfswood extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetLocation: 'hand',
            match: card => card.hasTrait('Direwolf'),
            effect: ability.effects.gainAmbush()
        });
    }
}

TheWolfswood.code = '01155';

module.exports = TheWolfswood;
