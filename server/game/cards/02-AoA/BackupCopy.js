const Card = require('../../Card.js');

class BackupCopy extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('destroyed', {
                effect: 'put {0} on the top of their deck',
                gameAction: ability.actions.returnToDeck()
            })
        });
    }
}

BackupCopy.id = 'backup-copy';

module.exports = BackupCopy;
