import Card from '../../Card.js';

class Thrall extends Card {
    // Destroyed: Your opponent discards a random card from their hand.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.discardAtRandom()
        });
    }
}

Thrall.id = 'thrall';

export default Thrall;
