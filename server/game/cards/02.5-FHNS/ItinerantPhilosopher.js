const DrawCard = require('../../drawcard.js');

class ItinerantPhilosopher extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow a character',
            condition: context => context.source.isParticipating(),
            cost: ability.costs.discardImperialFavor(),
            target: {
                cardType: 'character',
                controller: 'opponent',
                cardCondition: card => card.isParticipating() && card.attachments.size() > 0,
                gameAction: ability.actions.bow()
            }
        });
    }
}

ItinerantPhilosopher.id = 'itinerant-philosopher';

module.exports = ItinerantPhilosopher;
