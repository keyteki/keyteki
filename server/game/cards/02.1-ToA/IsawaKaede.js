const DrawCard = require('../../drawcard.js');

class IsawaKaede extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.immuneTo(context => context.source.type === 'ring' && context.player === this.controller.opponent)
        });
        this.persistentEffect({
            condition: () => this.isAttacking(),
            match: ring => ring.contested,
            effect: ability.effects.addElement('void')
        });
        this.persistentEffect({
            condition: () => this.isAttacking() && this.game.currentConflict.winner === this.controller,
            effect: ability.effects.modifyConflictElementsToResolve(5)
        });
    }
}

IsawaKaede.id = 'isawa-kaede';

module.exports = IsawaKaede;
