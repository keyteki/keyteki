const DrawCard = require('../../../drawcard.js');

class SerBarristanSelmy extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharactersKilled: event => event.allowSave
            },
            target: {
                activePromptTitle: 'Select character to save',
                cardCondition: (card, context) => context.event.cards.includes(card) && this.isControlledLordOrLady(card)
            },
            cost: ability.costs.standSelf(),
            handler: context => {
                context.event.saveCard(context.target);
                this.game.addMessage('{0} stands {1} to save {2}',
                                     this.controller, this, context.target);
            }
        });
    }

    isControlledLordOrLady(card) {
        return card.controller === this.controller && (card.hasTrait('Lord') || card.hasTrait('Lady'));
    }
}

SerBarristanSelmy.code = '02107';

module.exports = SerBarristanSelmy;
