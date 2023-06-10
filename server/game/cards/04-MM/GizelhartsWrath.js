const Card = require('../../Card.js');

class GizelhartsWrath extends Card {
    // Play: Destroy each Mutant creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.creaturesInPlay.filter((card) => card.hasTrait('mutant'))
            }))
        });
    }
}

GizelhartsWrath.id = 'gizelhart-s-wrath';

module.exports = GizelhartsWrath;
