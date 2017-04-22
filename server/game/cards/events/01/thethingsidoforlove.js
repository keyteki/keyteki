const DrawCard = require('../../../drawcard.js');

class TheThingsIDoForLove extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Return card to owners hand',
            condition: () => this.controller.anyCardsInPlay(card => card.hasTrait('Lord') || card.hasTrait('Lady')),
            phase: 'challenge',
            cost: ability.costs.kneelFactionCard(),
            target: {
                activePromptTitle: 'Select character',
                cardCondition: card => card.location === 'play area' && card.controller !== this.controller && card.getType() === 'character' && card.getCost() <= this.controller.gold
            },
            handler: context => {
                context.target.controller.moveCard(context.target, 'hand');
                context.player.gold -= context.target.getCost();

                this.game.addMessage('{0} uses {1} to return {2} to {3}\'s hand', context.player, this, context.target, context.target.owner);
            }
        });
    }
}

TheThingsIDoForLove.code = '01101';

module.exports = TheThingsIDoForLove;
