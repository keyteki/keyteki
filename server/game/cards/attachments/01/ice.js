const DrawCard = require('../../../drawcard.js');

class Ice extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyStrength(2)
        });
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => (
                    challenge.winner === this.controller &&
                    challenge.challengeType === 'military' &&
                    challenge.isParticipating(this.parent)
                )
            },
            cost: ability.costs.sacrificeSelf(),
            target: {
                activePromptTitle: 'Select a character to kill',
                cardCondition: card => card.location === 'play area' && card.controller !== this.controller && card.getType() === 'character',
                gameAction: 'kill'
            },
            handler: context => {
                context.target.owner.killCharacter(context.target);
                this.game.addMessage('{0} sacrifices {1} to kill {2}', context.player, this, context.target);
            }
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character' || !card.isFaction('stark')) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

Ice.code = '01153';

module.exports = Ice;
