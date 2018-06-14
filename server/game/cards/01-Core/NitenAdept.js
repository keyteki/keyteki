const DrawCard = require('../../drawcard.js');

class NitenAdept extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow character',
            condition: context => context.source.attachments.size() > 0 && context.source.isParticipating(),
            cost: ability.costs.bow((card, context) => card.getType() === 'attachment' && card.parent === context.source),
            target: {
                cardType: 'character', 
                cardCondition: card => card.isParticipating() && card.attachments.size() === 0,
                gameAction: ability.actions.bow()
            }
        });
    }
}

NitenAdept.id = 'niten-adept';

module.exports = NitenAdept;
