const Card = require('../../Card.js');

class AgentHooman extends Card {
    // Elusive.(The first time this creature is attacked each turn, no damage is dealt.)
    // Reap: Choose a friendly non-Mars creature and an enemy non-Mars creature. Stun the chosen creatures.
    setupCardAbilities(ability) {
        this.reap({
            targets: {
                friendly: {
                    mode: 'exactly',
                    numCards: 1,
                    cardType: 'creature',
                    cardCondition: (card) => !card.hasHouse('mars'),
                    controller: 'self',
                    gameAction: ability.actions.stun()
                },
                enemy: {
                    mode: 'exactly',
                    numCards: 1,
                    cardType: 'creature',
                    cardCondition: (card) => !card.hasHouse('mars'),
                    controller: 'opponent',
                    gameAction: ability.actions.stun()
                }
            }
        });
    }
}

AgentHooman.id = 'agent-hoo-man';

module.exports = AgentHooman;
