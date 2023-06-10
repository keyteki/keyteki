const Card = require('../../Card.js');

class ScientistsBane extends Card {
    // Play: Destroy a Scientist creature.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.game.creaturesInPlay.filter((card) => card.hasTrait('scientist')).length >
                0,
            optional: false,
            target: {
                cardType: 'creature',
                cardCondition: (card) => card.hasTrait('scientist'),
                gameAction: ability.actions.destroy()
            }
        });
    }
}

ScientistsBane.id = 'scientists--bane';

module.exports = ScientistsBane;
