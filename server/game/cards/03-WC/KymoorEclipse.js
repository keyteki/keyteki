const Card = require('../../Card.js');

class KymoorEclipse extends Card {
    // Play: Shuffle each flank creature into its owners deck.
    setupCardAbilities(ability) {
        this.play({
            gameAction: [
                ability.actions.returnToDeck((context) => ({
                    target: context.game.creaturesInPlay.filter(
                        (card) => card.isOnFlank() && card.owner === context.player
                    ),
                    shuffle: true
                })),
                ability.actions.returnToDeck((context) => ({
                    target: context.game.creaturesInPlay.filter(
                        (card) => card.isOnFlank() && card.owner === context.player.opponent
                    ),
                    shuffle: true,
                    shufflePlayer: context.player.opponent
                }))
            ]
        });
    }
}

KymoorEclipse.id = 'kymoor-eclipse';

module.exports = KymoorEclipse;
