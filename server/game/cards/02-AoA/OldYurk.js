import Card from '../../Card.js';

class OldYurk extends Card {
    // Play: Choose and discard 2cards from your hand.
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'self',
                mode: 'exactly',
                location: 'hand',
                numCards: 2,
                gameAction: ability.actions.discard()
            }
        });
    }
}

OldYurk.id = 'old-yurk';

export default OldYurk;
