const Card = require('../../Card.js');

class AncientYurk extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'self',
                location: 'hand',
                numCards: 3,
                gameAction: ability.actions.discard()
            }
        });
    }
}

AncientYurk.id = 'ancient-yurk';

module.exports = AncientYurk;
