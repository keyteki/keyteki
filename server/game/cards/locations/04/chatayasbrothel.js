const DrawCard = require('../../../drawcard.js');

class ChatayasBrothel extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel a character to gain gold',
            phase: 'marshal',
            limit: ability.limit.perPhase(2),
            cost: ability.costs.kneel(card => card.hasIcon('intrigue')),
            handler: context => {
                this.game.addGold(context.player, 1);
                this.game.addMessage('{0} uses {1} to kneel {2} to gain 1 gold', context.player, context.source, context.kneelingCostCard);
            }
        });
    }
}

ChatayasBrothel.code = '04090';

module.exports = ChatayasBrothel;
