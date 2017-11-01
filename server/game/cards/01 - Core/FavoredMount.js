const DrawCard = require('../../drawcard.js');

class FavoredMount extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addTrait('cavalry')
        });
        this.action({
            title: 'Move this character into the conflict',
            cost: ability.costs.bowSelf(),
            condition: () => this.game.currentConflict && this.parent.allowGameAction('moveToConflict'),
            handler: () => {
                this.game.addMessage('{0} bows {1} to move {2} into the conflict', this.controller, this, this.parent);
                this.game.currentConflict.moveToConflict(this.parent,this.game.currentConflict.attackingPlayer === this.controller);
            }
        });
    }

    canAttach(card) {
        if(card.controller !== this.controller) {
            return false;
        }
        return super.canAttach(card);
    }
}

FavoredMount.id = 'favored-mount';

module.exports = FavoredMount;
