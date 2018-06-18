const DrawCard = require('../../drawcard.js');

class DojiShizue extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            condition: () => this.game.currentPhase === 'fate' && this.controller.imperialFavor !== '',
            effect: [
                ability.effects.cardCannot('removeFate'),
                ability.effects.cardCannot('discardFromPlay')
            ]
        });
    }
}

DojiShizue.id = 'doji-shizue';

module.exports = DojiShizue;
