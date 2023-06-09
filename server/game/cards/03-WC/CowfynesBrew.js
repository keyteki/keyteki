const Card = require('../../Card.js');

class CowfynesBrew extends Card {
    // Play: Give a creature two +1 power counters.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.addPowerCounter({
                    amount: 2
                })
            }
        });
    }
}

CowfynesBrew.id = 'cowfyne-s-brew';

module.exports = CowfynesBrew;
