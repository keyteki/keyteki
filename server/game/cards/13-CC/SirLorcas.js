const Card = require('../../Card.js');

class SirLorcas extends Card {
    // If your red key is forged, Sir Lorcas gains skirmish.
    // If your yellow key is forged, Sir Lorcas gains elusive.
    // If your blue key is forged, Sir Lorcas gains taunt.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) => card === context.source && card.controller.keys.red,
            effect: ability.effects.addKeyword({ skirmish: 1 })
        });

        this.persistentEffect({
            match: (card, context) => card === context.source && card.controller.keys.yellow,
            effect: ability.effects.addKeyword({ elusive: 1 })
        });

        this.persistentEffect({
            match: (card, context) => card === context.source && card.controller.keys.blue,
            effect: ability.effects.addKeyword({ taunt: 1 })
        });
    }
}

SirLorcas.id = 'sir-lorcas';

module.exports = SirLorcas;
