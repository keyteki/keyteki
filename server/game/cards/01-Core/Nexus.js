const Card = require('../../Card.js');

class Nexus extends Card {
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'artifact',
                controller: 'opponent',
                gameAction: ability.actions.use()
            }
        });
    }
}

Nexus.id = 'nexus';

module.exports = Nexus;
