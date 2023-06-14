const Card = require('../../Card.js');

class LiamSay extends Card {
    // Elusive.
    // At the start of your turn, you may deal 1D to a creature.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onBeginRound: (_, context) => context.player === this.game.activePlayer
            },
            optional: true,
            target: {
                activePromptTitle: 'Choose a creature',
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 1 })
            }
        });
    }
}

LiamSay.id = 'liam-say';

module.exports = LiamSay;
