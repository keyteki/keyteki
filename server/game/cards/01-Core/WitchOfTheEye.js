import Card from '../../Card.js';

class WitchOfTheEye extends Card {
    // Reap: Return a card from your discard pile to your hand.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                location: 'discard',
                controller: 'self',
                gameAction: ability.actions.returnToHand({ location: 'discard' })
            }
        });
    }
}

WitchOfTheEye.id = 'witch-of-the-eye';

export default WitchOfTheEye;
