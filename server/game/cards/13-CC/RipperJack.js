const Card = require('../../Card.js');

class RipperJack extends Card {
    // Play: Steal 1.
    // After Fight: Put Ripper Jack into its owner's hand.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.steal()
        });

        this.fight({
            gameAction: ability.actions.returnToHand()
        });
    }
}

RipperJack.id = 'ripper-jack';

module.exports = RipperJack;
