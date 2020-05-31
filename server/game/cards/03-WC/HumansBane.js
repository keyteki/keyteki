const Card = require('../../Card.js');

class HumansBane extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.game.creaturesInPlay.filter((card) => card.hasTrait('human')).length > 0,
            optional: false,
            target: {
                cardType: 'creature',
                cardCondition: (card) => card.hasTrait('human'),
                gameAction: ability.actions.destroy()
            }
        });
    }
}

HumansBane.id = 'humans--bane';

module.exports = HumansBane;
