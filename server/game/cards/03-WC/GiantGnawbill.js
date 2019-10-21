const Card = require('../../Card.js');

class GiantGnawbill extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChooseActiveHouse: () => true
            },
            gameAction: ability.actions.destroy({
                promptForSelect: {
                    cardType: 'artifact',
                    controller: 'any',
                    cardCondition: (card, context) => card.hasHouse(context.event.house)
                }
            })
        });
    }
}

GiantGnawbill.id = 'giant-gnawbill';

module.exports = GiantGnawbill;
