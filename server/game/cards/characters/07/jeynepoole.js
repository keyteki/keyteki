const DrawCard = require('../../../drawcard.js');

class JeynePoole extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Sacrifice Jeyne Poole',
            phase: 'marshal',
            cost: ability.costs.sacrificeSelf(),
            target: {
                activePromptTitle: 'Select a Lady',
                cardCondition: card => (
                    card.location === 'discard pile' && 
                    card.controller === this.controller &&
                    card.hasTrait('Lady') && 
                    card.getType() === 'character')
            },
            handler: context => {
                context.player.moveCard(context.target, 'hand');
                this.game.addMessage('{0} sacrifices {1} to move {2} from their discard pile to their hand', 
                                      context.player, this, context.target);
            }
        });
    }
}

JeynePoole.code = '07033';

module.exports = JeynePoole;
