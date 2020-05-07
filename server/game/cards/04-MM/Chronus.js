const Card = require('../../Card.js');

class Chronus extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            optional: true,
            when: {
                onDrawCards: (event) => !!event.bonus
            },
            target: {
                controller: 'self',
                location: 'hand',
                gameAction: ability.actions.archive()
            }
        });
    }
}

Chronus.id = 'chronus';

module.exports = Chronus;
