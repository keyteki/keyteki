import Card from '../../Card.js';

class Oubliette extends Card {
    // Play: Purge a creature with power 3or lower.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                cardCondition: (card) => card.power <= 3,
                gameAction: ability.actions.purge()
            }
        });
    }
}

Oubliette.id = 'oubliette';

export default Oubliette;
