const DrawCard = require('../../drawcard.js');

class StandYourGround extends DrawCard {
    setupCardAbilities(ability) {
        this.wouldInterrupt({
            title: 'Prevent a character from leaving play',
            when: {
                onCardLeavesPlay: (event, context) => event.card.controller === context.player && event.card.isHonored
            },
            effect: 'prevent {1} from leaving play',
            effectArgs: context => context.event.card,
            cannotBeMirrored: true,
            handler: context => {
                context.event.window.addEvent(ability.actions.discardStatusToken().getEvent(context.event.card, context));
                context.cancel();
            }
        });
    }
}

StandYourGround.id = 'stand-your-ground';

module.exports = StandYourGround;
