const Card = require('../../Card.js');

class PanpacaAnga extends Card {
    // Creatures to the right of Panpaca, Anga in the battleline get +2power.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) =>
                card.controller.creaturesInPlay.indexOf(card) >
                card.controller.creaturesInPlay.indexOf(context.source),
            effect: ability.effects.modifyPower(2)
        });
    }
}

PanpacaAnga.id = 'panpaca-anga';

module.exports = PanpacaAnga;
