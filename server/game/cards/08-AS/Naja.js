import Card from '../../Card.js';

class Naja extends Card {
    // After Reap: Gain 3A.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.gainAmber({ amount: 3 })
        });
    }
}

Naja.id = 'naja';

export default Naja;
