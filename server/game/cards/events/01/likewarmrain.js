const DrawCard = require('../../../drawcard.js');

class LikeWarmRain extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => this.controller === challenge.loser && challenge.challengeType === 'intrigue' && challenge.defendingPlayer === this.controller
            },
            /// XXX This doesn't currently work for cards by title, ie events
            limit: ability.limit.perChallenge(1),
            cost: ability.costs.kneel(card => card.getType() === 'character' && card.hasTrait('Direwolf')),
            target: {
                activePromptTitle: 'Select a character to kill',
                cardCondition: card => card.location === 'play area' && this.game.currentChallenge.isAttacking(card),
                gameAction: 'kill'
            },
            handler: context => {
                context.target.owner.killCharacter(context.target);
                this.game.addMessage('{0} uses {1} to kneel {2} to kill {3}', context.player, context.source, context.kneelingCostCard, context.target);
            }
        });
    }

    onCardSelected(player, card) {
        this.game.addMessage('{0} uses {1} to give {2} Stealth', player, this, card);
        this.untilEndOfPhase(ability => ({
            match: card,
            effect: ability.effects.addKeyword('Stealth')
        }));

        return true;
    }
}

LikeWarmRain.code = '01158';

module.exports = LikeWarmRain;
