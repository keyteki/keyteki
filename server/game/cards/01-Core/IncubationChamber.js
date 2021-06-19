const Card = require('../../Card.js');

class IncubationChamber extends Card {
    setupCardAbilities(ability) {
        this.omni({
            target: {
                optional: true,
                cardType: 'creature',
                controller: 'self',
                location: 'hand',
                cardCondition: (card) => card.hasHouse('mars'),
                gameAction: ability.actions.archive({ reveal: true })
            }
        });
    }
}

IncubationChamber.id = 'incubation-chamber';

module.exports = IncubationChamber;
