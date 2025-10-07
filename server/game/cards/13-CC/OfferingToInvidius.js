import Card from '../../Card.js';

class OfferingToInvidius extends Card {
    // Play: Purge a creature from a discard pile.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                location: 'discard',
                gameAction: ability.actions.purge()
            }
        });
    }
}

OfferingToInvidius.id = 'offering-to-invidius';

export default OfferingToInvidius;
