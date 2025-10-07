import Card from '../../Card.js';

class WhisperingReliquary extends Card {
    // Action: Return an artifact to its owner's hand.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'artifact',
                gameAction: ability.actions.returnToHand()
            }
        });
    }
}

WhisperingReliquary.id = 'whispering-reliquary';

export default WhisperingReliquary;
