const DrawCard = require('../../../drawcard.js');

class MaesterAemon extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharactersKilled: event => event.allowSave
            },
            cost: ability.costs.kneelSelf(),
            target: {
                activePromptTitle: 'Select character to save',
                cardCondition: (card, context) => context.event.cards.includes(card) && card.isFaction('thenightswatch') && card.controller === this.controller
            },
            handler: context => {
                context.event.saveCard(context.target);
                this.game.addMessage('{0} kneels {1} to save {2}', this.controller, this, context.target);
            }
        });
    }
}

MaesterAemon.code = '01125';

module.exports = MaesterAemon;
