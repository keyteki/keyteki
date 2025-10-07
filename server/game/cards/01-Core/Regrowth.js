import Card from '../../Card.js';

class Regrowth extends Card {
    // Play: Return a creature from your discard pile to your hand.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                location: 'discard',
                controller: 'self',
                gameAction: ability.actions.returnToHand({ location: 'discard' })
            }
        });
    }
}

Regrowth.id = 'regrowth';

export default Regrowth;
