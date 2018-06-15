const DrawCard = require('../../drawcard.js');

class ShinjoOutrider extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move this character to conflict',
            gameAction: ability.actions.moveToConflict()
        });
    }
}

ShinjoOutrider.id = 'shinjo-outrider';

module.exports = ShinjoOutrider;
