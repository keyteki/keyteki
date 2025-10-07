import Card from '../../Card.js';

class IkwijiOutpost extends Card {
    // Action: Put a friendly creature on the bottom of its owners deck. If you do, draw 3 cards.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.returnToDeck({ bottom: true })
            },
            then: {
                gameAction: ability.actions.draw({ amount: 3 })
            }
        });
    }
}

IkwijiOutpost.id = 'ikwijĭ-outpost';

export default IkwijiOutpost;
