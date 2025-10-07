import Card from '../../Card.js';

class Fear extends Card {
    // Play: Return an enemy creature to its owners hand.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.returnToHand()
            }
        });
    }
}

Fear.id = 'fear';

export default Fear;
