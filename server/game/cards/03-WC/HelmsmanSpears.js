const Card = require('../../Card.js');

class HelmsmanSpears extends Card {
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
