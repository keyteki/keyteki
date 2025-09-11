const Card = require('../../Card.js');

class AStrongFeeling extends Card {
    // Play: Ready each friendly creature with A on it. Move 1 A from
    // each friendly creature to the common supply.
    setupCardAbilities(ability) {
        this.play({
            gameAction: [
                ability.actions.ready((context) => ({
                    target: context.player.creaturesInPlay.filter((c) => c.amber > 0)
                })),
                ability.actions.removeAmber((context) => ({
                    target: context.player.creaturesInPlay
                }))
            ]
        });
    }
}

AStrongFeeling.id = 'a-strong-feeling';

module.exports = AStrongFeeling;
