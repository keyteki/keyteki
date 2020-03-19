const Card = require('../../Card.js');

class MendingShaman extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: event => event.card.type === 'spell'
            },
            gameAction: ability.actions.heal({ fully: true })
        });
    }
}

MendingShaman.id = 'mendingshaman';

module.exports = MendingShaman;
