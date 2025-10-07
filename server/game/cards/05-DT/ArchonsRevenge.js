import Card from '../../Card.js';

class ArchonsRevenge extends Card {
    // Action: Exhaust up to 2 friendly Shadows creatures. For each creature exhausted this way, steal 1A.
    setupCardAbilities(ability) {
        this.action({
            target: {
                mode: 'upTo',
                numCards: 2,
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => card.hasHouse('shadows'),
                gameAction: ability.actions.exhaust()
            },
            then: {
                alwaysTriggers: true,
                condition: (context) => context.player.opponent,
                gameAction: ability.actions.steal((context) => ({
                    amount: context.preThenEvents.filter((event) => !event.cancelled).length
                }))
            }
        });
    }
}

ArchonsRevenge.id = 'archon-s-revenge';

export default ArchonsRevenge;
