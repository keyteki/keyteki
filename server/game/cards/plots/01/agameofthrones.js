const PlotCard = require('../../../plotcard.js');

class AGameOfThrones extends PlotCard {
    canChallenge(player, challengeType) {
        if((challengeType === 'power' || challengeType === 'military') && player.getNumberOfChallengesWon('intrigue') <= 0) {
            return false;
        }

        return true;
    }
}

AGameOfThrones.code = '01003';

module.exports = AGameOfThrones;
