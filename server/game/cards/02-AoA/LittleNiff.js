const Card = require('../../Card.js');

class LittleNiff extends Card {
    // Omega. Deploy. Elusive.
    // After a neighbor of Little Niff is used to fight, steal 1A.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onUseCard: (event, context) =>
                    event.fightEvent &&
                    event.fightEvent.attackerClone.neighbors.includes(context.source)
            },
            gameAction: ability.actions.steal()
        });
    }
}

LittleNiff.id = 'little-niff';

module.exports = LittleNiff;
