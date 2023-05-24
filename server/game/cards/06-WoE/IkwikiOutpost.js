const Card = require('../../Card.js');

class IkwikiOutpost extends Card {
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

IkwikiOutpost.id = 'ikwiki-outpost';

module.exports = IkwikiOutpost;
