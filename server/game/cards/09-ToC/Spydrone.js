import Card from '../../Card.js';

class Spydrone extends Card {
    // Action: Draw a card.
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.draw()
        });
    }
}

Spydrone.id = 'spydrone';

export default Spydrone;
