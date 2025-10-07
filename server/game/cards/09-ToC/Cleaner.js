import Card from '../../Card.js';

class Cleaner extends Card {
    // Action: Deal 3D to a creature.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 3 })
            }
        });
    }
}

Cleaner.id = 'cleaner';

export default Cleaner;
