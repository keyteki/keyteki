const Card = require('../../Card.js');

class CenturionStenopius extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.modifyPower(() => 3 * (this.tokens['amber'] || 0))
        });
        this.play({
            fight: true,
            reap: true,
            optional : true,
            gameAction: ability.actions.exalt()
        });
    }
}

CenturionStenopius.id = 'centurion-stenopius';

module.exports = CenturionStenopius;
