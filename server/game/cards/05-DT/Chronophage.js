const Card = require('../../Card.js');

class Chronophage extends Card {
    //Enemy artifacts and creatures gain Omega.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            match: (card) => card.type === 'artifact' || card.type === 'creature',
            effect: ability.effects.addKeyword({
                omega: 1
            })
        });
    }
}

Chronophage.id = 'chronophage';

module.exports = Chronophage;
