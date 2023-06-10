const Card = require('../../Card.js');

class HelmsmanSpears extends Card {
    // Fight/Reap: Discard any number of cards from your hand. Draw a card for each card discarded this way.
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            target: {
                controller: 'self',
                mode: 'unlimited',
                location: 'hand',
                gameAction: ability.actions.discard()
            },
            then: (preThenContext) => ({
                gameAction: ability.actions.draw({
                    amount: preThenContext.target.length
                })
            })
        });
    }
}

HelmsmanSpears.id = 'helmsman-spears';

module.exports = HelmsmanSpears;
