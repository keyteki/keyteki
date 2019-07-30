const Card = require('../../Card.js');

class OldYurk extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'self',
                mode: 'exactly',
                location: 'hand',
                numCards: 2,
                gameAction: ability.actions.discard()
            }
        });
    }
}

OldYurk.id = 'old-yurk';

module.exports = OldYurk;
