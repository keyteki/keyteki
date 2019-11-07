const Card = require('../../Card.js');

class PanpacaAnga extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) => card.controller.creaturesInPlay.indexOf(card) > card.controller.creaturesInPlay.indexOf(context.source),
            effect: ability.effects.modifyPower(2)
        });
    }
}

PanpacaAnga.id = 'panpaca-anga';

module.exports = PanpacaAnga;
