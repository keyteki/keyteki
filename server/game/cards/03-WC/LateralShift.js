const Card = require('../../Card.js');

class LateralShift extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'opponent',
                location: 'hand',
                gameAction: ability.actions.playCard()
            }
        });
    }
}

LateralShift.id = 'lateral-shift';

module.exports = LateralShift;
