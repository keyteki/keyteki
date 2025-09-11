const Card = require('../../Card.js');

class SedimentaryNap extends Card {
    // Play: Shuffle a creature into its owner's deck.
    // Fate: Shuffle the most powerful friendly creature into its owner's deck.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.returnToDeck({ shuffle: true })
            },
            effect: "shuffle {0} into its owner's deck"
        });

        this.fate({
            target: {
                mode: 'mostStat',
                cardType: 'creature',
                controller: 'opponent',
                numCards: 1,
                cardStat: (card) => card.power,
                gameAction: ability.actions.returnToDeck({ shuffle: true })
            }
        });
    }
}

SedimentaryNap.id = 'sedimentary-nap';

module.exports = SedimentaryNap;
