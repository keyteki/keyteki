const Card = require('../../Card.js');

class LightbringerOutpost extends Card {
    // Action: Put a friendly creature on the bottom of its owner`s deck. If you do, a friendly creature captures 3 Aember.
    setupCardAbilities(ability) {
        this.action({
            effect: 'put a friendly creature on the bottom of its owner`s deck and capture 3 amber',
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.returnToDeck({ bottom: true })
            },
            then: {
                target: {
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.capture({ amount: 3 })
                }
            }
        });
    }
}

LightbringerOutpost.id = 'lightbringer-outpost';

module.exports = LightbringerOutpost;
