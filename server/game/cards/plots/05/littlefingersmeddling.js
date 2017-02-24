const PlotCard = require('../../../plotcard.js');

class LittleFingersMeddling extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetType: 'player',
            targetController: 'current',
            effect: ability.effects.reduceCost({
                playingTypes: 'play',
                amount: 2,
                match: card => card.getType() === 'event'
            })
        });
    }
}

LittleFingersMeddling.code = '05049';

module.exports = LittleFingersMeddling;
