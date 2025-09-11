const Card = require('../../Card.js');

class ClippedWings extends Card {
    // Play: Choose one:
    // • Purge a random card from your opponent’s hand.
    // * Shuffle your opponent’s archives into their deck.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            targets: {
                action: {
                    mode: 'select',
                    choices: {
                        Purge: ability.actions.purgeAtRandom(),
                        Shuffle: ability.actions.returnToDeck((context) => ({
                            target: context.player.opponent.archives,
                            shufflePlayer: context.player.opponent,
                            shuffle: true
                        }))
                    }
                }
            }
        });
    }
}

ClippedWings.id = 'clipped-wings';

module.exports = ClippedWings;
