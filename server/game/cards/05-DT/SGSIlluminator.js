import Card from '../../Card.js';

class SGSIlluminator extends Card {
    // Action: Exhaust up to 4 friendly Sanctum creatures. For each creature exhausted this way, stun and exalt a creature.
    setupCardAbilities(ability) {
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
                    mode: 'exactly',
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

export default SGSIlluminator;
