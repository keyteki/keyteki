const DrawCard = require('../../../drawcard.js');

class Rattleshirt extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.game.currentChallenge
                && this.game.currentChallenge.isAttacking(this)
                && this.game.currentChallenge.attackers.length === 1,
            match: card =>
                card.getType() === 'character'
                && card.attachments.size() === 0,
            targetController: 'opponent',
            effect: ability.effects.cannotBeDeclaredAsDefender()
        });
    }
}

Rattleshirt.code = '07039';

module.exports = Rattleshirt;
