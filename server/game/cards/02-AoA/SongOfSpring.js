const Card = require('../../Card.js');

class SongOfSpring extends Card {
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
