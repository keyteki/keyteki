const Card = require('../../Card.js');

class NepentheSeed extends Card {
    setupCardAbilities(ability) {
        this.omni({
            target: {
                location: 'discard',
                controller: 'self',
                gameAction: ability.actions.returnToHand({ location: 'discard' })
            },
            gameAction: ability.actions.sacrifice()
        });
    }
}

NepentheSeed.id = 'nepenthe-seed';

module.exports = NepentheSeed;
