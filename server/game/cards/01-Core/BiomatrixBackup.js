const Card = require('../../Card.js');

class BiomatrixBackup extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('destroyed', {
                optional: true,
                gameAction: ability.actions.archive({ owner: true })
            })
        });
    }
}

BiomatrixBackup.id = 'biomatrix-backup'; // This is a guess at what the id might be - please check it!!!

module.exports = BiomatrixBackup;
