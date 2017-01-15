const DrawCard = require('../../../drawcard.js');

class TheSilverSteed extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: () => (
                this.game.currentChallenge &&
                this.game.currentChallenge.challengeType === 'power' &&
                this.game.currentChallenge.isParticipating(this.parent)
            ),
            effect: ability.effects.addKeyword('Renown')
        });
        this.reaction({
            when: {
                onRenown: (event, challenge, card) => card === this.parent
            },
            handler: () => {
                this.controller.sacrificeCard(this);

                this.untilEndOfPhase(ability => ({
                    targetType: 'player',
                    targetController: 'current',
                    effect: ability.effects.modifyChallengeTypeLimit('power', 1)
                }));

                this.game.addMessage('{0} sacrifices {1} to be able to initiate an additional {2} challenge this phase', this.controller, this, 'power');
            }
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character' || (!card.hasTrait('Dothraki') && card.name !== 'Daenerys Targaryen')) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

TheSilverSteed.code = '02054';

module.exports = TheSilverSteed;
