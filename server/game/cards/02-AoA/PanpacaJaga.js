const Card = require('../../Card.js');

class PanpacaJaga extends Card {
    // Skirmish.
    // Creatures to the left of Panpaca,
    // Jaga in the battleline gain skirmish.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) =>
                card.controller.cardsInPlay.indexOf(card) <
                card.controller.cardsInPlay.indexOf(context.source),
            effect: ability.effects.addKeyword({ skirmish: 1 })
        });
    }
}

PanpacaJaga.id = 'panpaca-jaga';

module.exports = PanpacaJaga;
