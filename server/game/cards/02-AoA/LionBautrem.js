const Card = require('../../Card.js');

class LionBautrem extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => this.neighbors.includes(card),
            effect: ability.effects.modifyPower(2)
        });
    }
}

LionBautrem.id = 'lion-bautrem'; // This is a guess at what the id might be - please check it!!!

module.exports = LionBautrem;
