const Card = require('../../Card.js');

class GravidCycle extends Card {
    // Omega. (After you play this card,
    // end this step.)
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

GravidCycle.id = 'gravid-cycle';

module.exports = GravidCycle;
