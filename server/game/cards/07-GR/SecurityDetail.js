const Card = require('../../Card.js');

class SecurityDetail extends Card {
    // Play: A friendly creature and each of its neighbors captures 1A.
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'self',
                cardType: 'creature',
                gameAction: ability.actions.capture((context) => ({
                    target: context.target.neighbors.concat(context.target)
                }))
            },
            effect: 'capture 1 amber onto {1}',
            effectArgs: (context) => [context.target.neighbors.concat(context.target)]
        });
    }
}

SecurityDetail.id = 'security-detail';

module.exports = SecurityDetail;
