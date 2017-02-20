const ChallengeEvent = require('../../challengeevent.js');

class WinterIsComing extends ChallengeEvent {

    // TODO implement restriction "(Max 1 per challenge.)"

    play(player) {
        this.untilEndOfChallenge(ability => ({
            match: card => card === player.activePlot,
            effect: ability.effects.modifyClaim(1)
        }));
    }

}

WinterIsComing.code = '01159';

module.exports = WinterIsComing;
