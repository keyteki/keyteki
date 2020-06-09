const Card = require('../../Card.js');

class CenturionStenopius extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyPower((card) => 3 * card.amber)
        });
        this.play({
            fight: true,
            reap: true,
            optional: true,
            gameAction: ability.actions.exalt()
        });
    }
}

CenturionStenopius.id = 'centurion-stenopius';

module.exports = CenturionStenopius;
