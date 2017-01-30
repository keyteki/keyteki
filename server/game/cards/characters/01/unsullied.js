const DrawCard = require('../../../drawcard.js');

class Unsullied extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentChallenge && this.game.currentChallenge.isAttacking(this),
            match: (card) => this.game.currentChallenge && this.game.currentChallenge.isDefending(card),
            targetController: 'opponent',
            recalculateWhen: ['onDefendersDeclared'],
            effect: ability.effects.modifyStrength(-1)
        });
    }
}

Unsullied.code = '01171';

module.exports = Unsullied;
