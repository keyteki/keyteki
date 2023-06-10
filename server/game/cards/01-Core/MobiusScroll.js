const Card = require('../../Card.js');

class MobiusScroll extends Card {
    // Action: Archive Mobius Scroll and up to 2 cards from your hand.
    setupCardAbilities(ability) {
        this.action({
            target: {
                controller: 'self',
                location: 'hand',
                mode: 'upTo',
                numCards: 2,
                gameAction: ability.actions.archive((context) => ({
                    target: [context.source].concat(context.target)
                }))
            }
        });
    }
}

MobiusScroll.id = 'mobius-scroll';

module.exports = MobiusScroll;
