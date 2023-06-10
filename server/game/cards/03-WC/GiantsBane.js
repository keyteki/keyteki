const Card = require('../../Card.js');

class GiantsBane extends Card {
    // Play: Destroy a Giant creature.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.game.creaturesInPlay.filter((card) => card.hasTrait('giant')).length > 0,
            optional: false,
            target: {
                cardType: 'creature',
                cardCondition: (card) => card.hasTrait('giant'),
                gameAction: ability.actions.destroy()
            }
        });
    }
}

GiantsBane.id = 'giants--bane';

module.exports = GiantsBane;
