import Card from '../../Card.js';

class Bombyx extends Card {
    // Play: Destroy a friendly Chenille. If you do not, destroy Bombyx.
    // Action: Return a Fifalde from your discard pile to your hand.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => card.name === 'Chenille',
                gameAction: ability.actions.destroy()
            },
            then: {
                alwaysTriggers: true,
                condition: (context) =>
                    context.preThenEvents &&
                    context.preThenEvents.filter((event) => !event.cancelled).length === 0,
                gameAction: ability.actions.destroy()
            }
        });

        this.action({
            target: {
                cardType: 'creature',
                location: 'discard',
                controller: 'self',
                cardCondition: (card) => card.name === 'Fifalde',
                gameAction: ability.actions.returnToHand({ location: 'discard' })
            }
        });
    }
}

Bombyx.id = 'bombyx';

export default Bombyx;
