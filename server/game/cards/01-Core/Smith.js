const Card = require('../../Card.js');

class Smith extends Card {
    // Play: Gain 2A if you control more creatures than your opponent.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.player.opponent &&
                context.player.opponent.creaturesInPlay.length <
                    context.player.creaturesInPlay.length,
            gameAction: ability.actions.gainAmber({ amount: 2 })
        });
    }
}

Smith.id = 'smith';

module.exports = Smith;
