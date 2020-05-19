const Card = require('../../Card.js');

class EncounterSuit extends Card {
    setupCardAbilities(ability) {
        this.reaction({
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
