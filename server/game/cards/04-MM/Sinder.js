const Card = require('../../Card.js');

class Sinder extends Card {
    setupCardAbilities(ability) {
        this.reap({
            target: {
                location: 'play area',
                controller: 'self',
                gameAction: ability.actions.destroy()
            }
        });
    }
}

Sinder.id = 'sinder';

module.exports = Sinder;
