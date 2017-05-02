const DrawCard = require('../../../drawcard.js');

class GuardingTheRealm extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Take control of character in discard pile',
            phase: 'marshal',
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => card.controller !== this.controller && card.location === 'discard pile' && card.getType() === 'character' && card.getCost() <= 3
            },
            handler: context => {
                this.controller.putIntoPlay(context.target);
                this.game.addMessage('{0} uses {1} to put {2} into play from {3}\'s discard pile under their control', 
                                      this.controller, this, context.target, context.target.owner);
            }
        });

        this.reaction({
            location: 'discard pile',
            when: {
                afterChallenge: (event, challenge) => challenge.winner === this.controller && !challenge.isAttackerTheWinner()
            },
            cost: ability.costs.payGold(1),
            handler: () => {
                this.game.addMessage('{0} pays 1 gold to move {1} back to their hand', this.controller, this);
                this.controller.moveCard(this, 'hand');
            }
        });
    }
}

GuardingTheRealm.code = '06026';

module.exports = GuardingTheRealm;
