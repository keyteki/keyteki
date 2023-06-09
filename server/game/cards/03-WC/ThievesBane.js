const Card = require('../../Card.js');

class ThievesBane extends Card {
    // Play: Destroy a Thief creature.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.game.creaturesInPlay.filter((card) => card.hasTrait('thief')).length > 0,
            optional: false,
            target: {
                cardType: 'creature',
                cardCondition: (card) => card.hasTrait('thief'),
                gameAction: ability.actions.destroy()
            }
        });
    }
}

ThievesBane.id = 'thieves--bane';

module.exports = ThievesBane;
