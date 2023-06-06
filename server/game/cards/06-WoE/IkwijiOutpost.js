const Card = require('../../Card.js');

class IkwijiOutpost extends Card {
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.returnToDeck({ bottom: true })
            },
            then: {
                gameAction: ability.actions.draw({ amount: 3 })
            }
        });
    }
}

IkwijiOutpost.id = 'ikwijĭ-outpost';

module.exports = IkwijiOutpost;
