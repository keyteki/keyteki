const Card = require('../../Card.js');

class SilverLinings extends Card {
    // Play: Gain 1A for each house represented among friendly flank
    // creatures.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.gainAmber((context) => ({
                amount: context.game.getHousesInPlay(context.player.creaturesInPlay, false, (c) =>
                    c.isOnFlank()
                ).length
            }))
        });
    }
}

SilverLinings.id = 'silver-linings';

module.exports = SilverLinings;
