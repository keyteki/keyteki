const Card = require('../../Card.js');

class MasterOfTheGrey extends Card {
    // Your opponent cannot resolve bonus icons on cards they play.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.playerCannot('resolveBonusIcons')
        });
    }
}

MasterOfTheGrey.id = 'master-of-the-grey';

module.exports = MasterOfTheGrey;
