import Card from '../../Card.js';

class AncientYurk extends Card {
    // Play: Choose and discard 3cards from your hand.
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'self',
                mode: 'exactly',
                location: 'hand',
                numCards: 3,
                gameAction: ability.actions.discard()
            }
        });
    }
}

AncientYurk.id = 'ancient-yurk';

export default AncientYurk;
