const Card = require('../../Card.js');

class EeOnTheFringes extends Card {
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
