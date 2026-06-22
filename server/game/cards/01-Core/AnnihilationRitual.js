const Card = require('../../Card.js');

class AnnihilationRitual extends Card {
    // When a creature would enter a discard pile from play, it is purged instead.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlaced: (event) =>
                    event.clone.type === 'creature' &&
                    event.to === 'discard' &&
                    event.from === 'play area'
            },
            gameAction: ability.actions.purge((context) => ({ target: context.event.card }))
        });
    }
}

AnnihilationRitual.id = 'annihilation-ritual';

module.exports = AnnihilationRitual;
