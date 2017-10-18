const DrawCard = require('../../drawcard.js');

class CautiousScout extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card === this.game.currentConflict.conflictProvince,
            targetLocation: 'province',
            targetController: 'opponent',
            condition: () => this.isAttacking() && this.game.currentConflict.attackers.length === 1,
            effect: ability.effects.blank
        });
    }
}

CautiousScout.id = 'cautious-scout';

module.exports = CautiousScout;
