const DrawCard = require('../../drawcard.js');

class IronMine extends DrawCard {
    setupCardAbilities(ability) {
        this.wouldInterrupt({
            title: 'Prevent a character from leaving play',
            when: {
                onCardLeavesPlay: (event, context) => event.card.controller === context.player && event.card.type === 'character' && 
                                                      context.source.allowGameAction('sacrifice', context)
            },
            effect: 'prevent {0} from leaving play',
            effectArgs: context => context.event.card,
            handler: context => {
                context.event.window.addEvent(ability.actions.sacrifice().getEvent(context.source, context));
                context.cancel();
            }
        });
    }
}

IronMine.id = 'iron-mine';

module.exports = IronMine;
