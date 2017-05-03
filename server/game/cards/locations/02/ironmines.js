const DrawCard = require('../../../drawcard.js');

class IronMines extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharactersKilled: event => event.allowSave
            },
            cost: ability.costs.sacrificeSelf(),
            target: {
                activePromptTitle: 'Select character to save',
                cardCondition: (card, context) => context.event.cards.includes(card) && card.controller === this.controller
            },
            handler: context => {
                context.event.saveCard(context.target);
                this.game.addMessage('{0} sacrifices {1} to save {2}', this.controller, this, context.target);
            }
        });
    }
}

IronMines.code = '02092';

module.exports = IronMines;
