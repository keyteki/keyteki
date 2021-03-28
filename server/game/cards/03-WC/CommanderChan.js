const Card = require('../../Card.js');

class CommanderChan extends Card {
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => card.exhausted === false,
                gameAction: ability.actions.use()
            }
        });
    }
}

CommanderChan.id = 'commander-chan';

module.exports = CommanderChan;
