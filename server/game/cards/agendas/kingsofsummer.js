const _ = require('underscore');

const AgendaCard = require('../../agendacard.js');

class KingsOfSummer extends AgendaCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: card => card === card.controller.activePlot,
            effect: ability.effects.modifyReserve(1)
        });
        this.persistentEffect({
            condition: () => _.all(this.game.getPlayers(), player => player.activePlot && !player.activePlot.hasTrait('Winter')),
            match: card => card === card.controller.activePlot && card.hasTrait('Summer'),
            effect: ability.effects.modifyGold(1)
        });
    }
}

KingsOfSummer.code = '04037';

module.exports = KingsOfSummer;
