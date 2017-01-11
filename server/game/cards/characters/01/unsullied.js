const DrawCard = require('../../../drawcard.js');

class Unsullied extends DrawCard {
    setupCardAbilities(dsl) {
        this.persistentEffect({
            condition: () => this.game.currentChallenge && this.game.currentChallenge.isAttacking(this),
            match: (card) => this.game.currentChallenge && this.game.currentChallenge.isDefending(card),
            targetController: 'opponent',
            effect: dsl.effects.modifyStrength(-1)
        });
    }
}

Unsullied.code = '01171';

module.exports = Unsullied;
