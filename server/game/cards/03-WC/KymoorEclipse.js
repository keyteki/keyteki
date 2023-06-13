const Card = require('../../Card.js');

class KymoorEclipse extends Card {
    // Play: Shuffle each flank creature into its owners deck.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.returnToDeck((context) => ({
                target: context.game.creaturesInPlay.filter((card) => card.isOnFlank()),
                shuffle: true
            }))
        });
    }
}

KymoorEclipse.id = 'kymoor-eclipse';

module.exports = KymoorEclipse;
