const Card = require('../../Card.js');

class PanpacaJaga extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.controller.cardsInPlay.indexOf(card) < card.controller.cardsInPlay.indexOf(this),
            effect: ability.effects.addKeyword({ skirmish: 1 })
        });
    }
}

PanpacaJaga.id = 'panpaca-jaga';

module.exports = PanpacaJaga;
