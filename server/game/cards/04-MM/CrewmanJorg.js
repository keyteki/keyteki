const Card = require('../../Card.js');

class CrewmanJorg extends Card {
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.steal((context) => ({
                amount: context.source.neighbors.some((card) => card.hasHouse('staralliance'))
                    ? 0
                    : 1
            }))
        });
    }
}

CrewmanJorg.id = 'crewman-jörg';

module.exports = CrewmanJorg;
