const DrawCard = require('../../drawcard.js');

class MatsuMitsuko extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move a character to the conflict',
            condition: context => this.game.isDuringConflict('military') && context.player && context.player.opponent.honor < context.player.honor,
            target: {
                cardType: 'character',
                controller: 'self',
                gameAction: ability.actions.moveToConflict()
            }
        });
    }
}

MatsuMitsuko.id = 'matsu-mitsuko';

module.exports = MatsuMitsuko;
