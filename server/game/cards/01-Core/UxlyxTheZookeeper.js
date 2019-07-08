const Card = require('../../Card.js');

class UxlyxTheZookeeper extends Card {
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.archive()
            }
        });
    }
}

UxlyxTheZookeeper.id = 'uxlyx-the-zookeeper';

module.exports = UxlyxTheZookeeper;
