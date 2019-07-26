const Card = require('../../Card.js');

class GravidCycle extends Card {
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
