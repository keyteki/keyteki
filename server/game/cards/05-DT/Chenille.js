import Card from '../../Card.js';

class Chenille extends Card {
    // Hazardous 6.
    // Action: Return a Bombyx from your discard pile to your hand.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                location: 'discard',
                controller: 'self',
                cardCondition: (card) => card.name === 'Bombyx',
                gameAction: ability.actions.returnToHand({ location: 'discard' })
            }
        });
    }
}

Chenille.id = 'chenille';

export default Chenille;
