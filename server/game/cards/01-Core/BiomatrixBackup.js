const Card = require('../../Card.js');

class BiomatrixBackup extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('destroyed', {
                gameAction: ability.actions.archive()
            })
        });
    }
}

BiomatrixBackup.id = 'biomatrix-backup';

module.exports = BiomatrixBackup;
