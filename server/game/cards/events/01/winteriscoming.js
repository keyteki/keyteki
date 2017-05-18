const ConflictEvent = require('../../conflictevent.js');

class WinterIsComing extends ConflictEvent {

    // TODO implement restriction "(Max 1 per challenge.)"
    setupCardAbilities() {
        this.action({
            title: 'Raise claim by 1',
            condition: () => this.game.currentConflict,
            handler: () => {
                this.untilEndOfChallenge(ability => ({
                    match: card => card === this.controller.activePlot,
                    effect: ability.effects.modifyClaim(1)
                }));

                this.game.addMessage('{0} uses {1} to raise the claim value on their revealed plot card by 1 until the end of the challenge', 
                                      this.controller, this);
            }
        });
    }
}

WinterIsComing.code = '01159';

module.exports = WinterIsComing;
