const AgendaCard = require('../../agendacard.js');

class KingsOfWinter extends AgendaCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: card => card === card.controller.activePlot,
            effect: ability.effects.modifyReserve(-1)
        });
        this.persistentEffect({
            condition: () => this.controller.activePlot && this.controller.activePlot.hasTrait('Winter'),
            targetController: 'opponent',
            match: card => card === card.controller.activePlot && !card.hasTrait('Summer'),
            effect: ability.effects.modifyGold(-1)
        });
    }
}

KingsOfWinter.code = '04038';

module.exports = KingsOfWinter;
