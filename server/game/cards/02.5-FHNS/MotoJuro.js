const DrawCard = require('../../drawcard.js');

class MotoJuro extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move this character to the conflict or home from the conflict',
            limit: ability.limit.perRound(2),
            gameAction: [ability.actions.sendHome(), ability.actions.moveToConflict()]
        });
    }
}

MotoJuro.id = 'moto-juro';

module.exports = MotoJuro;
