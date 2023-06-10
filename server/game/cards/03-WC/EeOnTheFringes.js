const Card = require('../../Card.js');

class EeOnTheFringes extends Card {
    // Elusive.
    // During your turn, after you discard a Dis card from your hand, you may purge a Dis card from a discard pile. If you do, steal 1A.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDiscarded: (event, context) =>
                    event.location === 'hand' &&
                    event.card.controller === context.player &&
                    context.game.activePlayer === context.player &&
                    event.card.hasHouse('dis')
            },
            target: {
                location: 'discard',
                mode: 'upTo',
                numCards: 1,
                cardCondition: (card) => card.hasHouse('dis'),
                gameAction: ability.actions.purge({ location: 'discard' })
            },
            then: () => ({
                gameAction: ability.actions.steal(),
                message: '{0} uses {1} to steal 1 amber'
            })
        });
    }
}

EeOnTheFringes.id = 'e-e-on-the-fringes';

module.exports = EeOnTheFringes;
