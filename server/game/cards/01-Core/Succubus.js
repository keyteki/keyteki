const Card = require('../../Card.js');

class Succubus extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.modifyHandSize(-1)
        });
    }
}

Succubus.id = 'succubus';

module.exports = Succubus;
