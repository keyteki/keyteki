const Card = require('../../Card.js');

class HiddenStash extends Card {
    // Play: Archive a card.
    setupCardAbilities(ability) {
        this.play({
            target: {
                location: 'hand',
                controller: 'self',
                gameAction: ability.actions.archive()
            }
        });
    }
}

HiddenStash.id = 'hidden-stash';

module.exports = HiddenStash;
