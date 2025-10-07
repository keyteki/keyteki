import Card from '../../Card.js';

class Wellstring extends Card {
    // After Fight/After Reap: Deal 3D to a creature.
    setupCardAbilities(ability) {
        this.reap({
            fight: true,
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 3 })
            }
        });
    }
}

Wellstring.id = 'wellstring';

export default Wellstring;
