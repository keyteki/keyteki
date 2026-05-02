const Card = require('../../Card.js');

class Hemogrith extends Card {
    // Play: If there are no enemy exhausted creatures, your opponent loses 2.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                !!context.player.opponent &&
                context.player.opponent.creaturesInPlay.every((card) => !card.exhausted),
            gameAction: ability.actions.loseAmber({ amount: 2 })
        });
    }
}

Hemogrith.id = 'hemogrith';

module.exports = Hemogrith;
