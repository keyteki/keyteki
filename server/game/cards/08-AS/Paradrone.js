import Card from '../../Card.js';

class Paradrone extends Card {
    // After Fight: A friendly creature captures 1A.
    setupCardAbilities(ability) {
        this.fight({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.capture()
            }
        });
    }
}

Paradrone.id = 'paradrone';

export default Paradrone;
