const Card = require('../../Card.js');

class HeistNight extends Card {
    // Alpha. (You can only play this card before doing anything else this step.)
    // Play: Steal 1A for each friendly Thief creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.steal((context) => ({
                amount: context.player.creaturesInPlay.filter((card) => card.hasTrait('thief'))
                    .length
            }))
        });
    }
}

HeistNight.id = 'heist-night';

module.exports = HeistNight;
