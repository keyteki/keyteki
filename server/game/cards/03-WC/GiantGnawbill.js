const Card = require('../../Card.js');

class GiantGnawbill extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChooseActiveHouse: () => true
            },
            target: {
                cardType: 'artifact',
                controller: 'any',
                cardCondition: (card, context) => card.hasHouse(context.event.house),
                gameAction: ability.actions.destroy()
            }
        });
    }
}

GiantGnawbill.id = 'giant-gnawbill';

module.exports = GiantGnawbill;
