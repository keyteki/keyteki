const Card = require('../../Card.js');

class BeastFighterUrso extends Card {
    //Play/Reap: You may unstun a creature.
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            target: {
                optional: true,
                cardType: 'creature',
                gameAction: ability.actions.removeStun()
            }
        });
    }
}

BeastFighterUrso.id = 'beast-fighter-urso';

module.exports = BeastFighterUrso;
