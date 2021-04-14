const Card = require('../../Card.js');

class SGSIlluminator extends Card {
    setupCardAbilities(ability) {
        // Action: Exhaust up to 4 friendly Sanctum creatures. Stun and exalt a creature for each creature exhausted this way.
        this.action({
            target: {
                numCards: 4,
                mode: 'upTo',
                controller: 'self',
                cardType: 'creature',
                cardCondition: (card) => card.hasHouse('sanctum'),
                gameAction: ability.actions.exhaust()
            },
            then: {
                alwaysTriggers: true,
                condition: (context) => context.preThenEvents.some((event) => !event.cancelled),
                target: {
                    cardType: 'creature',
                    numCards: (context) =>
                        context.preThenEvents.filter((event) => !event.cancelled).length,
                    gameAction: [ability.actions.stun(), ability.actions.exalt()]
                },
                message: '{0} uses {1} to stun and exalt {2}'
            }
        });
    }
}

SGSIlluminator.id = 'sgs-illuminator';

module.exports = SGSIlluminator;
