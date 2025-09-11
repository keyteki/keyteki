const Card = require('../../Card.js');

class CWOTucheay extends Card {
    // Play/After Reap: Fully heal and use a friendly creature.
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.sequential([
                    ability.actions.heal({ fully: true }),
                    ability.actions.use()
                ])
            },
            effect: 'fully heal and use {0}'
        });
    }
}

CWOTucheay.id = 'cwo-tucheay';

module.exports = CWOTucheay;
