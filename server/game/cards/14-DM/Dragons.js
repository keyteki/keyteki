const Card = require('../../Card.js');

class Dragons extends Card {
    // Play: Shuffle any number of Dragon creatures from your discard pile into your deck.
    setupCardAbilities(ability) {
        this.play({
            target: {
                location: 'discard',
                controller: 'self',
                mode: 'unlimited',
                cardType: 'creature',
                cardCondition: (card) => card.hasTrait('dragon'),
                gameAction: ability.actions.returnToDeck({ shuffle: true })
            },
            effect: 'shuffle {0} into their deck'
        });
    }
}

Dragons.id = 'dragons';

module.exports = Dragons;
