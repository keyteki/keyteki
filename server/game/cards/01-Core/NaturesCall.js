const Card = require('../../Card.js');

class NaturesCall extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'upTo',
                numCards: 3,
                cardType: 'creature',
                gameAction: ability.actions.returnToHand()
            }
        });
    }
}

NaturesCall.id = 'nature-s-call'; // This is a guess at what the id might be - please check it!!!

module.exports = NaturesCall;
