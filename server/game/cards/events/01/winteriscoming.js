const ChallengeEvent = require('../../challengeevent.js');

class WinterIsComing extends ChallengeEvent {

    // TODO implement restriction "(Max 1 per challenge.)"
    setupCardAbilities() {
        this.action({
            title: 'Raise claim by 1',
            condition: () => this.game.currentChallenge,
            handler: () => {
                this.untilEndOfChallenge(ability => ({
                    match: card => card === this.controller.activePlot,
                    effect: ability.effects.modifyClaim(1)
                }));
            }
        });
    }
}

WinterIsComing.code = '01159';

module.exports = WinterIsComing;
