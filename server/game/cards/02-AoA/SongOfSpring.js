const Card = require('../../Card.js');

class SongOfSpring extends Card {
    // Play: Shuffle any number of friendly Untamed creatures from your hand, discard pile, or battleline back into your deck.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'unlimited',
                location: ['play area', 'discard', 'hand'],
                cardCondition: (card) => card.type === 'creature' && card.hasHouse('untamed'),
                controller: 'self',
                gameAction: ability.actions.returnToDeck({ shuffle: true })
            }
        });
    }
}

SongOfSpring.id = 'song-of-spring';

module.exports = SongOfSpring;
