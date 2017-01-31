const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class ManceRayder extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetLocation: 'hand',
            condition: () => _.all(this.game.getPlayers(), player => !player.activePlot || !player.activePlot.hasTrait('Winter')),
            match: card => card.hasTrait('Wildling'),
            effect: ability.effects.gainAmbush()
        });
        this.persistentEffect({
            targetLocation: 'hand',
            condition: () => _.any(this.game.getPlayers(), player => player.activePlot && player.activePlot.hasTrait('Winter')),
            match: card => card.hasTrait('Wildling'),
            effect: ability.effects.gainAmbush(-1)
        });
    }
}

ManceRayder.code = '03039';

module.exports = ManceRayder;
