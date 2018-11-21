const Card = require('../../Card.js');

class AnnihilationRitual extends Card {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.constantReaction({
            when: {
                onCardPlaced: event => event.card.type === 'creature' && event.to === 'discard' && event.from === 'play area'
            },
            gameAction: ability.actions.purge(context => ({ target: context.event.card }))
        });
    }
}

AnnihilationRitual.id = 'annihilation-ritual-'; // This is a guess at what the id might be - please check it!!!

module.exports = AnnihilationRitual;
