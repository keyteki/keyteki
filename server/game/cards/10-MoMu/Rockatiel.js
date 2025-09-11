const Card = require('../../Card.js');

class Rockatiel extends Card {
    // Play/After Reap: Choose up to 2 creatures. Shuffle each chosen
    // creature into its owner’s deck.
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            target: {
                numCards: 2,
                mode: 'upTo',
                cardType: 'creature',
                controller: 'any',
                gameAction: ability.actions.returnToDeck({ shuffle: true })
            },
            effect: "shuffle {1} into their owner's deck",
            effectArgs: (context) => [context.target]
        });
    }
}

Rockatiel.id = 'rockatiel';

module.exports = Rockatiel;
