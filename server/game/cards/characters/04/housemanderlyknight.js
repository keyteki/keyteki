const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class HouseManderlyKnight extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => _.any(this.game.getPlayers(), player => player.activePlot && player.activePlot.hasTrait('Winter')),
            match: this,
            effect: ability.effects.modifyStrength(2)
        });
    }
}

HouseManderlyKnight.code = '04101';

module.exports = HouseManderlyKnight;
