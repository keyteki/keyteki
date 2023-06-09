const Card = require('../../Card.js');

class MatingSeason extends Card {
    // Play: Shuffle each Mars creature into its owners deck. Each player gains 1<A> for each creature shuffled into their deck this way.
    setupCardAbilities(ability) {
        this.play({
            effect:
                "shuffle each Mars creature into their owner's deck, and each player gains 1 amber for each creature shuffled into their deck",
            gameAction: [
                ability.actions.gainAmber((context) => ({
                    amount: context.player.creaturesInPlay.filter((card) => card.hasHouse('mars'))
                        .length
                })),
                ability.actions.gainAmber((context) => ({
                    target: context.player.opponent,
                    amount: context.player.opponent
                        ? context.player.opponent.creaturesInPlay.filter((card) =>
                              card.hasHouse('mars')
                          ).length
                        : 0
                })),
                ability.actions.returnToDeck((context) => ({
                    shuffle: true,
                    target: context.game.creaturesInPlay.filter((card) => card.hasHouse('mars'))
                }))
            ]
        });
    }
}

MatingSeason.id = 'mating-season';

module.exports = MatingSeason;
