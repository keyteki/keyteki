const Card = require('../../Card.js');

class LongfusedMines extends Card {
    // Omni: Sacrifice Longfused Mines.
    // Deal 3D to each enemy creature
    // not on a flank.
    setupCardAbilities(ability) {
        this.omni({
            effect: 'deal 3 damage to each non-flank enemy creature',
            gameAction: [
                ability.actions.sacrifice(),
                ability.actions.dealDamage((context) => ({
                    amount: 3,
                    target: context.game.creaturesInPlay.filter(
                        (card) => card.controller !== context.player && !card.isOnFlank()
                    )
                }))
            ]
        });
    }
}

LongfusedMines.id = 'longfused-mines';

module.exports = LongfusedMines;
