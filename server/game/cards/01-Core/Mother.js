const Card = require('../../Card.js');

class Mother extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyHandSize(1)
        });
    }
}

Mother.id = 'mother'; // This is a guess at what the id might be - please check it!!!

module.exports = Mother;
