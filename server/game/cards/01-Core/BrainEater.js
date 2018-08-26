const Card = require('../../Card.js');

class BrainEater extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onFight: (event, context) => event.attacker === context.source && event.destroyed.includes(event.defender) ||
                                             event.defender === context.source && event.destroyed.includes(event.attacker)
            },
            gameAction: ability.actions.draw()
        });
    }
}

BrainEater.id = 'brain-eater'; // This is a guess at what the id might be - please check it!!!

module.exports = BrainEater;
