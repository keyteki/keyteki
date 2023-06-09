const Card = require('../../Card.js');

class CenturionStenopius extends Card {
    // Centurion Stenopius gets +3 power for each A on it.
    // Play/Fight/Reap: You may exalt Centurion Stenopius.
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
