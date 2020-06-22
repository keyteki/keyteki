const Card = require('../../Card.js');

class LiamSay extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPhaseStarted: (event, context) =>
                    event.phase === 'key' && context.player === this.game.activePlayer
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
