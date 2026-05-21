const Card = require('../../Card.js');

class KyypaxEncapsulator extends Card {
    // After Reap: Put an enemy creature into its owner’s archives.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.putIntoArchives()
            }
        });
    }
}

KyypaxEncapsulator.id = 'kyypax-encapsulator';

module.exports = KyypaxEncapsulator;
