const PlotCard = require('../../../plotcard.js');

class TheFireThatBurns extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.isFaction('thenightswatch') && card.getType() === 'character',
            effect: ability.effects.doesNotKneelAsDefender()
        });
    }
}

TheFireThatBurns.code = '07046';

module.exports = TheFireThatBurns;
