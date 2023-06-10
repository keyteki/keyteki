const Card = require('../../Card.js');

class LateralShift extends Card {
    // Play: Look at your opponents hand. Play a card from that hand as if it were yours.
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'opponent',
                revealTargets: true,
                location: 'hand',
                gameAction: ability.actions.playCard()
            }
        });
    }
}

LateralShift.id = 'lateral-shift';

module.exports = LateralShift;
