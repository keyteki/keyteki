const Card = require('../../Card.js');

class PhloxemSpike extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'destroy each creature not on a flank.',
            condition: () => this.controller.creaturesInPlay.length === 0,
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.creaturesInPlay.filter((card) => !card.isOnFlank())
            }))
        });
    }
}

PhloxemSpike.id = 'phloxem-spike';

module.exports = PhloxemSpike;
