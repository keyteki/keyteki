const Card = require('../../Card.js');

class PaxSauriana extends Card {
    //Play: Ward each creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.ward((context) => ({
                target: context.game.creaturesInPlay
            }))
        });
    }
}

PaxSauriana.id = 'pax-sauriana';

module.exports = PaxSauriana;
