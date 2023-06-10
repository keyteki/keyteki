const Card = require('../../Card.js');

class RecordedHistory extends Card {
    // Play: Reveal up to 3 cards of different houses from your
    // hand. Archive each card revealed this way.
    setupCardAbilities(ability) {
        this.play({
            target: {
                optional: true,
                mode: 'upTo',
                numCards: 3,
                controller: 'self',
                location: 'hand',
                uniqueCardHouses: true,
                gameAction: ability.actions.archive()
            }
        });
    }
}

RecordedHistory.id = 'recorded-history';

module.exports = RecordedHistory;
