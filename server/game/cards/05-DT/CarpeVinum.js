import Card from '../../Card.js';

class CarpeVinum extends Card {
    // Play: Exalt 2 enemy creatures.
    setupCardAbilities(ability) {
        this.play({
            target: {
                numCards: 2,
                mode: 'exactly',
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.exalt()
            }
        });
    }
}

CarpeVinum.id = 'carpe-vinum';

export default CarpeVinum;
