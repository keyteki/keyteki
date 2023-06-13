const Card = require('../../Card.js');

class PerilousWild extends Card {
    // Play: Destroy each elusive creature.
    setupCardAbilities(ability) {
        this.play({
            effect: 'destroy each elusive creature',
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.creaturesInPlay.filter((card) => card.hasKeyword('elusive'))
            }))
        });
    }
}

PerilousWild.id = 'perilous-wild';

module.exports = PerilousWild;
