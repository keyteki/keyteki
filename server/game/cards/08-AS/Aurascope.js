import Card from '../../Card.js';

class Aurascope extends Card {
    // Action: Discard a card. If you do, purge a card of the same
    // type as the discarded card from a discard pile.
    setupCardAbilities(ability) {
        this.action({
            target: {
                mode: 'exactly',
                numCards: 1,
                location: 'hand',
                controller: 'self',
                gameAction: ability.actions.discard()
            },
            then: (preThenContext) => ({
                target: {
                    mode: 'exactly',
                    numCards: 1,
                    location: 'discard',
                    controller: 'any',
                    cardCondition: (card) => card.type === preThenContext.target[0].type,
                    gameAction: ability.actions.purge()
                },
                message: '{0} uses {1} to purge {3}',
                messageArgs: (context) => [context.target]
            })
        });
    }
}

Aurascope.id = 'aurascope';

export default Aurascope;
