const Card = require('../../Card.js');

class ShĭGzisŏBuggy extends Card {
    //Action: Destroy a friendly creature. If you do, gain 2A.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.destroy()
            },
            then: {
                gameAction: ability.actions.gainAmber({ amount: 2 })
            }
        });
    }
}

ShĭGzisŏBuggy.id = 'shigziso-buggy';

module.exports = ShĭGzisŏBuggy;
