const Card = require('../../Card.js');

class Envy extends Card {
    // Elusive.
    // Reap: If there are 2 or more friendly Sin creatures, capture all of your opponents A.
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
