const DrawCard = require('../../../drawcard.js');

class WinterfellKennelMaster extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel a Direwolf to have it participate in the current challenge',
            phase: 'challenge',
            limit: ability.limit.perPhase(1),
            condition: () => this.isStarkCardParticipatingInChallenge(),
            cost: ability.costs.kneel(card => this.isDirewolfOrHasAttachment(card) && card.canParticipateInChallenge()),
            handler: context => {
                var card = context.kneelingCostCard;
                if(this.game.currentChallenge.attackingPlayer === context.player) {
                    this.game.currentChallenge.addAttacker(card);
                } else {
                    this.game.currentChallenge.addDefender(card);
                }

                this.game.addMessage('{0} uses {1} to kneel {2} and add them to the challenge', context.player, this, card);
            }
        });
    }

    isStarkCardParticipatingInChallenge() {
        return this.game.currentChallenge && this.controller.anyCardsInPlay(card => {
            return this.game.currentChallenge.isParticipating(card) && card.isFaction('stark');
        });
    }

    isDirewolfOrHasAttachment(card) {
        return card.hasTrait('Direwolf') || card.attachments.any(attachment => attachment.hasTrait('Direwolf'));
    }
}

WinterfellKennelMaster.code = '02021';

module.exports = WinterfellKennelMaster;
