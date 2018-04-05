const DrawCard = require('../../drawcard.js');

class YogoKikuyo extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            title: 'Cancel a spell',
            when: {
                onCardAbilityInitiated: event => this.game.currentConflict && event.card.type === 'event' &&
                                          event.card.hasTrait('spell') && event.card.controller === this.controller.opponent

            },
            cost: ability.costs.putSelfIntoPlay(),
            location: 'hand',
            canCancel: true,
            handler: context => {
                this.game.addMessage('{0} puts {1} into play to cancel the effects of {2}', this.controller, this, context.event.card);
                context.cancel();
            }
        });
    }
}

YogoKikuyo.id = 'yogo-kikuyo';

module.exports = YogoKikuyo;
