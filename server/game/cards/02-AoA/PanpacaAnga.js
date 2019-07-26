const Card = require('../../Card.js');

class PanpacaAnga extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.controller.cardsInPlay.indexOf(card) > card.controller.cardsInPlay.indexOf(this),
            effect: ability.effects.modifyPower(2)
        });
    }
}

PanpacaAnga.id = 'panpaca-anga';

module.exports = PanpacaAnga;
