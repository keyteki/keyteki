import Card from '../../Card.js';

class WitchOfTheDawn extends Card {
    // Play: Return a creature from your discard pile to your hand.
    setupCardAbilities(ability) {
        this.play({
            target: {
                location: 'discard',
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.returnToHand({ location: 'discard' })
            }
        });
    }
}

WitchOfTheDawn.id = 'witch-of-the-dawn';

export default WitchOfTheDawn;
