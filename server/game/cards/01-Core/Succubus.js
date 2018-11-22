const Card = require('../../Card.js');

class Succubus extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.modifyHandSize(-1)
        });
    }
}

Succubus.id = 'succubus'; // This is a guess at what the id might be - please check it!!!

module.exports = Succubus;
