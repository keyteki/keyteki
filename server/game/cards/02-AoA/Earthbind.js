const Card = require('../../Card.js');

class Earthbind extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: (context) =>
                context.game.cardsDiscarded.filter(
                    (card) => card.controller === context.source.parent.controller
                ).length === 0,
            effect: ability.effects.cardCannot('use')
        });
    }
}

Earthbind.id = 'earthbind';

module.exports = Earthbind;
