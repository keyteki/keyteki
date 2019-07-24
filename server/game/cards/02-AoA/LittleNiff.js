const Card = require('../../Card.js');

class LittleNiff extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onFight: (event, context) => context.source.neighbors.includes(event.attacker)
            },
            gameAction: ability.actions.steal()
        });
    }
}

LittleNiff.id = 'little-niff';

module.exports = LittleNiff;
