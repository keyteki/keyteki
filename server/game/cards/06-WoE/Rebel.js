import Card from '../../Card.js';

class Rebel extends Card {
    //Reap: Deal 1D to a creature.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 1 })
            }
        });
    }
}

Rebel.id = 'rebel';

export default Rebel;
