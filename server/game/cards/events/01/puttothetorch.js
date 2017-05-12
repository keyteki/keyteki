const DrawCard = require('../../../drawcard.js');

class PutToTheTorch extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => (
                    challenge.challengeType === 'military' &&
                    challenge.winner === this.controller &&
                    challenge.strengthDifference >= 5
                )
            },
            target: {
                activePromptTitle: 'Select a location to discard',
                cardCondition: card => card.location === 'play area' && card.controller !== this.controller && card.getType() === 'location',
                gameAction: 'discard'
            },
            handler: (context) => {
                context.target.controller.discardCard(context.target);
                this.game.addMessage('{0} uses {1} to discard {2}', context.player, this, context.target);
            }
        });
    }
}

PutToTheTorch.code = '01042';

module.exports = PutToTheTorch;
