const Card = require('../../Card.js');

class WhisperingReliquary extends Card {
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'artifact',
                gameAction: ability.actions.returnToHand()
            }
        });
    }
}

WhisperingReliquary.id = 'whispering-reliquary'; // This is a guess at what the id might be - please check it!!!

module.exports = WhisperingReliquary;
