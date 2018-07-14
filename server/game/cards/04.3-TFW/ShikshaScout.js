const DrawCard = require('../../drawcard.js');

class ShikshaScout extends DrawCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.persistentEffect({
            condition: () => this.isParticipating(),
            effect: ability.effects.additionalCharactersInConflict(1)
        });
    }
}

ShikshaScout.id = 'shiksha-scout';

module.exports = ShikshaScout;
