const Card = require('../../Card.js');

class TaniwhaEvilTwin extends Card {
    // Fight/Reap: Put a creature from your discard pile on top of your deck.
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            target: {
                cardType: 'creature',
                controller: 'self',
                location: 'discard',
                gameAction: ability.actions.returnToDeck({ location: 'discard' })
            }
        });
    }
}

TaniwhaEvilTwin.id = 'taniwha-evil-twin';

module.exports = TaniwhaEvilTwin;
