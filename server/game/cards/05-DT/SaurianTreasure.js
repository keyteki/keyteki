const Card = require('../../Card.js');

class SaurianTreasure extends Card {
    // Play: Put 4 on Saurian Treasure ?. A friendly creature captures 1A.
    // At the start of a player's turn, if they control at least four creatures with on them, move all from Saurian Treasure ? to their pool.
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'self',
                gameAction: ability.actions.capture()
            },
            gameAction: ability.actions.placeAmber({
                amount: 4,
                target: this
            })
        });

        this.reaction({
            when: {
                onBeginRound: (_, context) =>
                    context.game.activePlayer &&
                    context.game.activePlayer.creaturesInPlay.filter((card) => card.amber).length >=
                        4
            },
            gameAction: ability.actions.removeAmber({ all: true }),
            then: {
                gameAction: ability.actions.gainAmber((context) => ({
                    amount: context.preThenEvent.amount,
                    target: context.game.activePlayer
                }))
            }
        });
    }
}

SaurianTreasure.id = 'saurian-treasure';

module.exports = SaurianTreasure;
