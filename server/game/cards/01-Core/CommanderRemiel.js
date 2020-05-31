const Card = require('../../Card.js');

class CommanderRemiel extends Card {
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => !card.hasHouse('sanctum'),
                gameAction: ability.actions.use()
            }
        });
    }
}

CommanderRemiel.id = 'commander-remiel';

module.exports = CommanderRemiel;
