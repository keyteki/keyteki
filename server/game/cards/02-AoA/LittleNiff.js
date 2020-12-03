const Card = require('../../Card.js');

class LittleNiff extends Card {
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
