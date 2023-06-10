const Card = require('../../Card.js');

class Glimmer extends Card {
    // Alpha. (You can only play this card before doing anything else this step.)
    // Play: Return a card from your discard pile to your hand.
    setupCardAbilities(ability) {
        this.play({
            target: {
                location: 'discard',
                controller: 'self',
                gameAction: ability.actions.returnToHand({ location: 'discard' })
            }
        });
    }
}

Glimmer.id = 'glimmer';

module.exports = Glimmer;
