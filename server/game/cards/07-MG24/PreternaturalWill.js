const Card = require('../../Card.js');

class PreternaturalWill extends Card {
    // Play: Fully heal each friendly Keyraken creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.heal((context) => ({
                fully: true,
                target: context.player.creaturesInPlay.filter((card) => card.hasHouse('keyraken'))
            }))
        });
    }
}

PreternaturalWill.id = 'preternatural-will';

module.exports = PreternaturalWill;
