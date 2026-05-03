const Card = require('../../Card.js');

class Knuckler extends Card {
    // Deploy. Entrench.
    // While Knuckler is exhausted, each of its neighbors gets +2 armor.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.exhausted,
            match: (card, context) => context.source.neighbors.includes(card),
            effect: ability.effects.modifyArmor(2)
        });
    }
}

Knuckler.id = 'knuckler';

module.exports = Knuckler;
