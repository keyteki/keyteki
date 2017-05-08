const DrawCard = require('../../../drawcard.js');

class RickonStark extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onBeforeDeckSearch: event => event.player !== this.controller // Strictly speaking the rules don't apply this restriction but it's probably going to be annoying not to have it
            },
            cost: ability.costs.sacrificeSelf(),
            handler: context => {
                context.event.cancel();
                
                this.game.addMessage('{0} sacrifices {1} to cancel {2}', this.controller, this, context.event.source);
            }
        });
    }
}

RickonStark.code = '03016';

module.exports = RickonStark;
