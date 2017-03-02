const DrawCard = require('../../../drawcard.js');

class Chett extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel a steward to return a direwolf or raven',
            cost: ability.costs.kneel(card => card.hasTrait('Steward') && card.getType() === 'character'),
            phase: 'dominance',
            limit: ability.limit.perPhase(1),
            handler: context => {
                this.game.promptForSelect(context.player, {
                    cardCondition: card => card.location === 'discard pile' && (card.hasTrait('Direwolf') || card.hasTrait('Raven')),
                    activePromptTitle: 'Select Direwolf or Raven card',
                    source: this,
                    onSelect: (player, card) => {
                        player.moveCard(card, 'hand');
                        this.game.addMessage('{0} uses {1} to kneel {2} to return {3} to their hand', 
                                              context.player, this, context.kneelingCostCard, card);
                    }
                });
            }
        });
    }
}

Chett.code = '02085';

module.exports = Chett;
