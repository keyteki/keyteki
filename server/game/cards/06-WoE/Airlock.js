import Card from '../../Card.js';

class Airlock extends Card {
    //Action: Discard a non-Mars card from your hand. If you do, draw a card.
    setupCardAbilities(ability) {
        this.action({
            target: {
                controller: 'self',
                location: 'hand',
                cardCondition: (card) => !card.hasHouse('mars'),
                gameAction: ability.actions.discard()
            },
            then: {
                gameAction: ability.actions.draw({ amount: 1 })
            }
        });
    }
}

Airlock.id = 'airlock';

export default Airlock;
