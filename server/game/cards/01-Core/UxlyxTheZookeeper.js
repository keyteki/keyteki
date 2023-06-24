const Card = require('../../Card.js');

class UxlyxTheZookeeper extends Card {
    // Elusive. (The first time this creature is attacked each turn, no damage is dealt.)
    // Reap: Put an enemy creature into your archives. If that creature leaves your archives, it is put into its owners hand instead.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.archive({ owner: false })
            }
        });
    }
}

UxlyxTheZookeeper.id = 'uxlyx-the-zookeeper';

module.exports = UxlyxTheZookeeper;
