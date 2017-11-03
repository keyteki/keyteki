const DrawCard = require('../../drawcard.js');

class NitenAdept extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow character',
            condition: () => this.attachments.size() > 0 && this.isParticipating(),
            cost: ability.costs.bow(card => card.getType() === 'attachment' && card.parent === this),
            target: {
                activePromptTitle: 'Choose a character to bow',
                cardType: 'character',
                gameAction: 'bow',
                cardCondition: card => card.attachments && card.attachments.size() === 0 && card.isParticipating() && !card.bowed
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to bow {2} by bowing {3}', this.controller, this, context.target, context.costs.bow);
                this.controller.bowCard(context.target, context.source);
            }
        });
    }
}

NitenAdept.id = 'niten-adept';

module.exports = NitenAdept;
