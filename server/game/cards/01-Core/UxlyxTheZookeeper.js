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

UxlyxTheZookeeper.id = 'uxlyx-the-zookeeper'; // This is a guess at what the id might be - please check it!!!

module.exports = UxlyxTheZookeeper;
