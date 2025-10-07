import Card from '../../Card.js';

class Searine extends Card {
    // Scrap: Deal 2D to a friendly creature.
    setupCardAbilities(ability) {
        this.scrap({
            target: {
                controller: 'self',
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 2 })
            }
        });
    }
}

Searine.id = 'searine';

export default Searine;
