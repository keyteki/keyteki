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

Nexus.id = 'nexus'; // This is a guess at what the id might be - please check it!!!

module.exports = Nexus;
