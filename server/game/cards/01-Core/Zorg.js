const Card = require('../../Card.js');

class Zorg extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            gameAction: ability.actions.stun()
        });

        this.interrupt({
            when: {
                onFight: (event, context) => event.attacker === context.source
            },
            gameAction: ability.actions.stun(context => ({ target: context.event.card.neighbors.concat(context.event.card) }))
        });
    }
}

Zorg.id = 'zorg';

module.exports = Zorg;
