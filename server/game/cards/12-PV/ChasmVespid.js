const Card = require('../../Card.js');

class ChasmVespid extends Card {
    // Skirmish. Splash-attack 1.
    // Fate: Archive each friendly creature not on a flank.
    setupCardAbilities(ability) {
        this.fate({
            gameAction: ability.actions.archive((context) => ({
                target: context.game.activePlayer.creaturesInPlay.filter(
                    (card) => !card.isOnFlank()
                )
            }))
        });
    }
}

ChasmVespid.id = 'chasm-vespid';

module.exports = ChasmVespid;
