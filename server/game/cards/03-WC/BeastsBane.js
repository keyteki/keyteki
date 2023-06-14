const Card = require('../../Card.js');

class BeastsBane extends Card {
    // Play: Destroy a Beast creature.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.game.creaturesInPlay.filter((card) => card.hasTrait('beast')).length > 0,
            optional: false,
            target: {
                cardType: 'creature',
                cardCondition: (card) => card.hasTrait('beast'),
                gameAction: ability.actions.destroy()
            }
        });
    }
}

BeastsBane.id = 'beasts--bane';

module.exports = BeastsBane;
