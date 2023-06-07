const Card = require('../../Card.js');

class Flounderight extends Card {
    // Destroyed: Destroy the creature on your opponent's right flank.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.destroy((context) => ({
                target: context.player.opponent
                    ? context.player.opponent.creaturesInPlay.slice(-1)
                    : []
            }))
        });
    }
}

Flounderight.id = 'flounderight';

module.exports = Flounderight;
