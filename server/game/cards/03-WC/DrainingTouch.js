const Card = require('../../Card.js');

class DrainingTouch extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.game.creaturesInPlay.length > 0,
            optional: false,
            target: {
                cardType: 'creature',
                cardCondition: (card) => !card.hasToken('amber'),
                gameAction: ability.actions.destroy()
            }
        });
    }
}

DrainingTouch.id = 'draining-touch';

module.exports = DrainingTouch;
