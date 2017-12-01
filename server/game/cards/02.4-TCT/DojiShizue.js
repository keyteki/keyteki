const DrawCard = require('../../drawcard.js');

class DojiShizue extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            condition: () => this.game.currentPhase === 'fate' && this.controller.imperialFavor !== '',
            effect: [
                ability.effects.cannotRemoveFate(),
                ability.effects.cannotBeDiscarded()
            ]
        });
    }
}

DojiShizue.id = 'doji-shizue';

module.exports = DojiShizue;
