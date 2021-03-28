const Card = require('../../Card.js');

class Zorg extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.entersPlayStunned()
        });

        this.beforeFight({
            gameAction: ability.actions.stun((context) => ({
                target: context.event.card.neighbors.concat(context.event.card)
            }))
        });
    }
}

Zorg.id = 'zorg';

module.exports = Zorg;
