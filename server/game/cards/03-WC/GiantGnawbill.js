const Card = require('../../Card.js');

class GiantGnawbill extends Card {
    // After a player chooses an active house, that player destroys an artifact of that house.
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
