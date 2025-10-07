import Card from '../../Card.js';

class BigSal extends Card {
    // Play: Make 2 token creatures.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.makeTokenCreature({ amount: 2 })
        });
    }
}

BigSal.id = 'big-sal';

export default BigSal;
