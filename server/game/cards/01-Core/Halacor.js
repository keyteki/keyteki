const Card = require('../../Card.js');

class Halacor extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.controller === this.controller && card.isOnFlank(),
            effect: ability.effects.addKeyword({ skirmish: 1 })
        });
    }
}

Halacor.id = 'halacor'; // This is a guess at what the id might be - please check it!!!

module.exports = Halacor;
