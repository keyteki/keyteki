const DrawCard = require('../../../drawcard.js');

class BranStark extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: event => event.source.getType() === 'event' && event.player !== this.controller
            },
            cost: ability.costs.sacrificeSelf(),
            handler: context => {
                context.event.cancel();
                
                this.game.addMessage('{0} sacrifices {1} to cancel {2}', this.controller, this, context.event.source);
            }
        });
    }
}

BranStark.code = '01142';

module.exports = BranStark;
