const Card = require('../../Card.js');

class DozeWing extends Card {
    // Play: Exhaust each non-Dragon creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.exhaust((context) => ({
                target: context.game.creaturesInPlay.filter((card) => !card.hasTrait('dragon'))
            })),
            effect: 'exhaust each non-Dragon creature'
        });
    }
}

DozeWing.id = 'doze-wing';

module.exports = DozeWing;
