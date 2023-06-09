const Card = require('../../Card.js');

class LionBautrem extends Card {
    // Deploy. (This creature can enter play anywhere in your battleline.)
    // Lion Bautrems neighbors get +2power.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) => context.source.neighbors.includes(card),
            effect: ability.effects.modifyPower(2)
        });
    }
}

LionBautrem.id = 'lion-bautrem';

module.exports = LionBautrem;
