const Card = require('../../Card.js');

class Gluttony extends Card {
    // Play: Exalt Gluttony once for each friendly Sin creature.
    // Reap: Move each A from friendly creatures to your pool.
    setupCardAbilities(ability) {
        this.play({
            effect: 'exalt {0} once for each friendly sin creature in play',
            gameAction: ability.actions.exalt((context) => ({
                target: context.source,
                amount: context.player.creaturesInPlay.filter((card) => card.hasTrait('sin')).length
            }))
        });
        this.reap({
            effect: 'move each amber from friendly creatures to their pool',
            gameAction: [
                ability.actions.removeAmber((context) => ({
                    all: true,
                    target: context.player.creaturesInPlay.filter((card) => card.amber > 0)
                })),
                ability.actions.gainAmber((context) => ({
                    amount: context.player.creaturesInPlay.reduce(
                        (total, card) => total + card.amber,
                        0
                    )
                }))
            ]
        });
    }
}

Gluttony.id = 'gluttony';

module.exports = Gluttony;
