const PlotCard = require('../../../plotcard.js');

class WardensOfTheNorth extends PlotCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel a character to have it participate in the current challenge',
            phase: 'challenge',
            limit: ability.limit.perRound(2),
            condition: () => this.isStarkCardParticipatingInChallenge(),
            cost: ability.costs.kneel(card => card.getType() === 'character' && card.isFaction('stark') && card.canParticipateInChallenge()),
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
}

WardensOfTheNorth.code = '02062';

module.exports = WardensOfTheNorth;
