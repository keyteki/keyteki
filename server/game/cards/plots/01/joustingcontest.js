const PlotCard = require('../../../plotcard.js');

class JoustingContest extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetType: 'player',
            targetController: 'any',
            effect: ability.effects.setChallengerLimit(1)
        });
    }
}

JoustingContest.code = '01014';

module.exports = JoustingContest;
