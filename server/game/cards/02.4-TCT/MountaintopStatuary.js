const DrawCard = require('../../drawcard.js');

class MountaintopStatuary extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Move this to stronghold province',
            when: {
                onDynastyCardTurnedFaceup: event => event.card === this
            },
            handler: () => {
                this.game.addMessage('{0} uses {1}, moving it to their stronghold province', this.controller, this);
                this.controller.moveCard(this, 'stronghold province');
            }
        });
        this.action({
            title: 'Send a 2 or lower cost character home',
            cost: ability.costs.sacrificeSelf(),
            condition: () => this.game.currentConflict && this.game.currentConflict.conflictProvince && this.game.currentConflict.conflictProvince.location === this.location,
            target: {
                cardType: 'character',
                gameAction: 'sendHome',
                cardCondition: card => card.isAttacking() && card.getCost() < 3
            },
            handler: context => {
                this.game.addMessage('{0} sacrifices {1} to send {2} home', this.controller, this, context.target);
                this.game.currentConflict.sendHome(context.target, this);
            }
        });
    }
}

MountaintopStatuary.id = 'mountaintop-statuary'; 

module.exports = MountaintopStatuary;
