const Card = require('../../Card.js');

class Smith extends Card {
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
