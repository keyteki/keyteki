const DrawCard = require('../../../drawcard.js');

class Aggo extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand a Bloodrider (if a Summer plot is revealed)',
            condition: () => this.game.anyPlotHasTrait('Summer'),
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.hasTrait('Bloodrider')
            },
            limit: ability.limit.perRound(1),
            handler: context => {
                this.game.addMessage('{0} uses {1} to stand {2}', context.player, this, context.target);
                this.controller.standCard(context.target);
            }
        });
    }
}

Aggo.code = '03035';

module.exports = Aggo;
