import Card from '../../Card.js';

class Addlefish extends Card {
    // After Fight: Your opponent discards 2 random cards from their hand.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.discardAtRandom({ amount: 2 })
        });
    }
}

Addlefish.id = 'addlefish';

export default Addlefish;
