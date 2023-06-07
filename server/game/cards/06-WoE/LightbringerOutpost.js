const Card = require('../../Card.js');

class LightbringerOutpost extends Card {
    // Action: Put a friendly creature on the bottom of its owner`s deck. If you do, a friendly creature captures 3 Aember.
    setupCardAbilities(ability) {
        this.action({
            effect: 'put a friendly creature on the bottom of its owner`s deck',
            target: {
                cardType: 'creature',
                controller: 'self',
                activePromptTitle: 'Choose a card to move to bottom of deck',
                gameAction: ability.actions.returnToDeck({ bottom: true })
            },
            then: {
                message: '{0} uses {1} to capture 3 amber onto {2}',
                target: {
                    cardType: 'creature',
                    controller: 'self',
                    activePromptTitle: 'Choose a creature to capture amber',
                    gameAction: ability.actions.capture({ amount: 3 })
                }
            }
        });
    }
}

LightbringerOutpost.id = 'lightbringer-outpost';

module.exports = LightbringerOutpost;
