const Card = require('../../Card.js');

class ForceField extends Card {
    // This creature gains, "Reap: Ward this creature."
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('reap', {
                gameAction: ability.actions.ward()
            })
        });
    }
}

ForceField.id = 'force-field';

module.exports = ForceField;
