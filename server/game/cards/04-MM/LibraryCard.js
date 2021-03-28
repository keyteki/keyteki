const Card = require('../../Card.js');

class LibraryCard extends Card {
    setupCardAbilities(ability) {
        this.action({
            effect:
                'purge {0} and then draw a card after playing a card for the remainder of the turn',
            gameAction: ability.actions.purge(),
            then: {
                gameAction: ability.actions.forRemainderOfTurn((context) => ({
                    when: {
                        onCardPlayed: (event) => event.player === context.player
                    },
                    gameAction: ability.actions.draw((context) => ({ target: context.player }))
                }))
            }
        });
    }
}

LibraryCard.id = 'library-card';

module.exports = LibraryCard;
