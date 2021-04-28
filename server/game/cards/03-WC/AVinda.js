const Card = require('../../Card.js');

class AVinda extends Card {
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 1 })
            },
            then: (context) => ({
                condition: () => context.target.location !== 'play area',
                message: '{0} uses {1} to make {3} discard a card at random',
                messageArgs: (context) => context.player.opponent,
                gameAction: ability.actions.discardAtRandom()
            })
        });
    }
}

AVinda.id = 'a-vinda';

module.exports = AVinda;
