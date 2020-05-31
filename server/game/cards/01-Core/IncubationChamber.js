const Card = require('../../Card.js');

class IncubationChamber extends Card {
    setupCardAbilities(ability) {
        this.omni({
            target: {
                cardType: 'creature',
                controller: 'self',
                location: 'hand',
                cardCondition: (card) => card.hasHouse('mars'),
                gameAction: ability.actions.archive()
            },
            effect: 'reveal {0} and archive it'
        });
    }
}

IncubationChamber.id = 'incubation-chamber';

module.exports = IncubationChamber;
