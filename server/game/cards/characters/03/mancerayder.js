const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class ManceRayder extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetLocation: 'hand',
            match: card => card.hasTrait('Wildling'),
            effect: ability.effects.gainAmbush()
        });
        this.persistentEffect({
            condition: () => _.any(this.game.getPlayers(), player => player.activePlot && player.activePlot.hasTrait('Winter')),
            targetType: 'player',
            targetController: 'current',
            effect: ability.effects.reduceAmbushCardCost(1, card => card.hasTrait('Wildling'))
        });
    }
}

ManceRayder.code = '03039';

module.exports = ManceRayder;
