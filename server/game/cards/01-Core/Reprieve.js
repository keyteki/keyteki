const DrawCard = require('../../drawcard.js');

class Reprieve extends DrawCard {
    setupCardAbilities(ability) {
        this.wouldInterrupt({
            title: 'Prevent a character from leaving play',
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source.parent &&
                                                      context.source.allowGameAction('discardFromPlay', context)
            },
            effect: 'prevent {1} from leaving play',
            effectArgs: context => context.event.card,
            handler: context => {
                context.cancel();
                context.event.window.addEvent(ability.actions.discardFromPlay().getEvent(context.source, context));
            }
        });
    }
}

Reprieve.id = 'reprieve';

module.exports = Reprieve;
