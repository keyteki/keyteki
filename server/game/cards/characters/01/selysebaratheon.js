const DrawCard = require('../../../drawcard.js');

class SelyseBaratheon extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Pay 1 gold to give an intrigue icon to a character',
            cost: ability.costs.payGold(1),
            target: {
                activePromptTitle: 'Select character',
                cardCondition: card => card.location === 'play area' && card.isFaction('baratheon') && card.getType() === 'character'
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to give {2} an {3} icon', context.player, this, context.target, 'intrigue');
                this.untilEndOfPhase(ability => ({
                    match: context.target,
                    effect: ability.effects.addIcon('intrigue')
                }));
            }
        });
    }
}

SelyseBaratheon.code = '01049';

module.exports = SelyseBaratheon;
