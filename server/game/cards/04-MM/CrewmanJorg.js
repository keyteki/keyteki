const Card = require('../../Card.js');

class CrewmanJorg extends Card {
    // Enhance PT. (These icons have already been added to cards in your deck.)
    // Action: If Crewman Jrg has no Star Alliance neighbors, steal 1A.
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
