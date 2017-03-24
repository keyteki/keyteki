const DrawCard = require('../../../drawcard.js');

class TheNewGift extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel a steward to gain 1 gold',
            phase: 'marshal',
            limit: ability.limit.perPhase(2),
            cost: ability.costs.kneel(card => card.hasTrait('Steward') && card.getType() === 'character'),
            handler: context => {
                this.game.addGold(context.player, 1);
                this.game.addMessage('{0} uses {1} to kneel {2} to gain 1 gold', context.player, context.source, context.kneelingCostCard);
            }
        });

        this.action({
            title: 'Kneel a steward to draw 1 card',
            phase: 'challenge',
            limit: ability.limit.perPhase(2),
            cost: ability.costs.kneel(card => card.hasTrait('Steward') && card.getType() === 'character'),
            handler: context => {
                this.controller.drawCardsToHand(1);
                this.game.addMessage('{0} uses {1} to kneel {2} to draw 1 card', context.player, context.source, context.kneelingCostCard);
            }
        });
    }
}

TheNewGift.code = '07017';

module.exports = TheNewGift;
