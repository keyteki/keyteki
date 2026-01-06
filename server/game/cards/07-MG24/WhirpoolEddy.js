const Card = require('../../Card.js');

class WhirpoolEddy extends Card {
    // Action: Stun and exhaust a creature that is not already stunned.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                cardCondition: (card) => !card.stunned,
                gameAction: [ability.actions.stun(), ability.actions.exhaust()]
            }
        });
    }
}

WhirpoolEddy.id = 'whirpool-eddy';

module.exports = WhirpoolEddy;
