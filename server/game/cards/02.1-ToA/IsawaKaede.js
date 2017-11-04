const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class IsawaKaede extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.immuneTo(context => context.source && context.source.type === 'ring' && context.source.controller !== this.controller)
        });
        this.persistentEffect({
            condition: () => this.isAttacking && _.any(this.game.rings, ring => ring.contested),
            match: this,
            effect: ability.effects.addConflictElement('void')
        });
        this.persistentEffect({
            condition: () => this.isAttacking && this.game.currentConflict.winner === this.controller,
            match: this,
            effect: ability.effects.modifyConflictElementsToResolve(5)
        });
    }
}

IsawaKaede.id = 'isawa-kaede';

module.exports = IsawaKaede;
