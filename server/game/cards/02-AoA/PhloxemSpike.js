const Card = require('../../Card.js');

class PhloxemSpike extends Card {
    // Play: If there are no friendly creatures in play, destroy each creature not on a flank.
    setupCardAbilities(ability) {
        this.play({
            effect: 'destroy each creature not on a flank.',
            condition: (context) => context.player.creaturesInPlay.length === 0,
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.creaturesInPlay.filter((card) => !card.isOnFlank())
            }))
        });
    }
}

PhloxemSpike.id = 'phloxem-spike';

module.exports = PhloxemSpike;
