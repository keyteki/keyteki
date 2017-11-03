const DrawCard = require('../../drawcard.js');

class TogashiInitiate extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Honor this character',
            condition: () => this.game.currentConflict && this.game.currentConflict.isAttacking(this),
            cost: ability.costs.payFateToRing(1),
            handler: context => {
                this.game.addMessage('{0} uses {1} to honor itself by paying 1 fate to the {2} ring', this.controller,this, context.costs.payFateToRing.element);
                this.controller.honorCard(this, context.source);
            }
        });
    }
}

TogashiInitiate.id = 'togashi-initiate';

module.exports = TogashiInitiate;
