const Card = require('../../Card.js');

class EncounterSuit extends Card {
    // After an action card is played, but before resolving its play effect, ward this creature.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCardPlayed: (event) => event.card.type === 'action'
            },
            autoResolve: true,
            gameAction: ability.actions.ward((context) => ({ target: context.source.parent }))
        });
    }
}

EncounterSuit.id = 'encounter-suit';

module.exports = EncounterSuit;
