const Card = require('../../Card.js');

class LionBautrem extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => this.neighbors.includes(card),
            effect: ability.effects.modifyPower(2)
        });
    }
}

LionBautrem.id = 'lion-bautrem';

module.exports = LionBautrem;
