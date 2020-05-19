const Card = require('../../Card.js');

class AgentHooman extends Card {
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
