const DrawCard = require('../../drawcard.js');

class TogashiInitiate extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Honor this character',
            condition: () => this.game.currentConflict && this.game.currentConflict.isAttacking(this),
            cost: ability.costs.payFateToRing(1),
            handler: () => {
                this.game.addMessage('{0} uses {1} to honor itself', this.controller, this);
                this.controller.honorCard(this);
            }
        });
    }
}

TogashiInitiate.id = 'togashi-initiate';

module.exports = TogashiInitiate;
