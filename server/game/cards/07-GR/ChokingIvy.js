const Card = require('../../Card.js');

class ChokingIvy extends Card {
    // Play: Destroy each creature with the lowest power. If you are
    // not haunted, repeat the preceding effect.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.destroy((context) => {
                if (context.game.creaturesInPlay.length === 0) {
                    return { target: [] };
                }

                let lowestPower = context.game.creaturesInPlay.sort((a, b) => a.power - b.power)[0]
                    .power;

                return {
                    target: context.game.creaturesInPlay.filter(
                        (card) => card.power === lowestPower
                    )
                };
            }),
            then: {
                alwaysTriggers: true,
                condition: (context) => !context.player.isHaunted(),
                gameAction: ability.actions.destroy((context) => {
                    if (context.game.creaturesInPlay.length === 0) {
                        return { target: [] };
                    }

                    let lowestPower = context.game.creaturesInPlay.sort(
                        (a, b) => a.power - b.power
                    )[0].power;

                    return {
                        target: context.game.creaturesInPlay.filter(
                            (card) => card.power === lowestPower
                        )
                    };
                }),
                message: '{0} uses {1} to destroy the lowest-powered creatures again'
            }
        });
    }
}

ChokingIvy.id = 'choking-ivy';

module.exports = ChokingIvy;
