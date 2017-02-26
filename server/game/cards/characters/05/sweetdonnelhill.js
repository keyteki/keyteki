const DrawCard = require('../../../drawcard.js');

class SweetDonnelHill extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentChallenge && this.game.currentChallenge.isDefending(this),
            match: (card) => this.game.currentChallenge.isAttacking(card) && card.getType() === 'character',
            targetController: 'any',
            effect: ability.effects.removeAllKeywords()
        });
    }
}

SweetDonnelHill.code = '05031';

module.exports = SweetDonnelHill;
