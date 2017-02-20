const ChallengeEvent = require('../../challengeevent.js');

class InTheNameOfYourKing extends ChallengeEvent {

    constructor(owner, cardData) {
        super(owner, cardData, 'military', 'defender');
    }

    canPlay(player, card) {
        return (super.canPlay(player, card)
                && !this.controller.faction.kneeled);
    }

    play(player) {
        player.kneelCard(player.faction);
        this.game.currentChallenge.cancelChallenge();
        this.untilEndOfPhase(ability => ({
            targetType: 'player',
            targetController: 'current',
            effect: ability.effects.setChallengeTypeLimit('military', 0)
        }));

        this.game.addMessage('{0} uses {1} to end this challenge with no winner or loser',
                             player, this);
    }
}

InTheNameOfYourKing.code = '02028';

module.exports = InTheNameOfYourKing;
