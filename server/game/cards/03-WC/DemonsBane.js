const Card = require('../../Card.js');

class DemonsBane extends Card {
    // Play: Destroy a Demon creature.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.game.creaturesInPlay.filter((card) => card.hasTrait('demon')).length > 0,
            optional: false,
            target: {
                cardType: 'creature',
                cardCondition: (card) => card.hasTrait('demon'),
                gameAction: ability.actions.destroy()
            }
        });
    }
}

DemonsBane.id = 'demons--bane';

module.exports = DemonsBane;
