const Card = require('../../Card.js');

class OnyxKnight extends Card {
    // Play: Destroy each creature with odd power.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.creaturesInPlay.filter((card) => card.power % 2 !== 0)
            }))
        });
    }
}

OnyxKnight.id = 'onyx-knight';

module.exports = OnyxKnight;
