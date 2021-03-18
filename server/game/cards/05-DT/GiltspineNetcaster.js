const Card = require('../../Card.js');

class GiltspineNetcaster extends Card {
    //Reap: Exhaust a creature.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.exhaust()
            }
        });
    }
}

GiltspineNetcaster.id = 'giltspine-netcaster';

module.exports = GiltspineNetcaster;
