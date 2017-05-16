const DrawCard = require('../../../drawcard.js');

class LastHearthScouts extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onCardEntersPlay: event => this.controller.phase === 'challenge' && event.card.getType() === 'character'
            },
            handler: (context) => {
                context.event.card.controller.kneelCard(context.event.card);

                this.game.addMessage('{0} uses {1} to kneel {2}', this.controller, this, context.event.card);
            }
        });
    }
}

LastHearthScouts.code = '05034';

module.exports = LastHearthScouts;
