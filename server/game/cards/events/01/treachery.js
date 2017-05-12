const DrawCard = require('../../../drawcard.js');

class Treachery extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            canCancel: true,
            when: {
                onCardAbilityInitiated: event => {
                    if((event.source.getType() !== 'character' && event.source.getType() !== 'location' && event.source.getType() !== 'attachment') ||
                            event.player === this.controller) {
                        return false;
                    }

                    if(!this.controller.anyCardsInPlay(card => card.isUnique() && card.isFaction('lannister'))) {
                        return false;
                    }

                    return true;
                }
            },
            handler: context => {
                context.event.cancel();

                this.game.addMessage('{0} plays {1} to cancel {2}', this.controller, this, context.event.source);
            }
        });
    }
}

Treachery.code = '01102';

module.exports = Treachery;
