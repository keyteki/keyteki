const Card = require('../../Card.js');

class CommanderChan extends Card {
    // Fight/Reap: Use another friendly creature.
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
