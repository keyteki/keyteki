const Card = require('../../Card.js');

class Earthbind extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: () => !this.game.cardsDiscarded.length,
            effect: ability.effects.cardCannot('use')
        });
    }
}

Earthbind.id = 'earthbind';

module.exports = Earthbind;
