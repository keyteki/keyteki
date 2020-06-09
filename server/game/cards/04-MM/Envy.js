const Card = require('../../Card.js');

class Envy extends Card {
    setupCardAbilities(ability) {
        this.reap({
            condition: (context) =>
                context.player.opponent &&
                context.player.creaturesInPlay.filter((card) => card.hasTrait('sin')).length >= 2,
            gameAction: ability.actions.capture((context) => ({
                amount: context.player.opponent.amber
            }))
        });
    }
}

Envy.id = 'envy';

module.exports = Envy;
