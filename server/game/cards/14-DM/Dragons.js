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
            effect: 'shuffle {1} into their deck',
            effectArgs: (context) => [
                context.target && context.target.length > 0 ? context.target : 'nothing'
            ]
        });
    }
}

Dragons.id = 'dragons';

module.exports = Dragons;
