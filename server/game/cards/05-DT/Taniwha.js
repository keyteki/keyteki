const Card = require('../../Card.js');

class Taniwha extends Card {
    //Fight/Reap: Destroy a friendly creature and gain 1A.
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.destroy()
            },
            gameAction: ability.actions.gainAmber({ amount: 1 })
        });
    }
}

Taniwha.id = 'taniwha';

module.exports = Taniwha;
