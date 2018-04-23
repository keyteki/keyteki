const DrawCard = require('../../drawcard.js');

class IronMine extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Prevent a character from leaving play',
            when: {
                onCardLeavesPlay: (event, context) => event.card.controller === context.player && event.card.type === 'character' && 
                                                      this.allowGameAction('sacrifice', context)
            },
            canCancel: true,
            handler: context => {
                this.game.addMessage('{0} uses {1} to save {2}', this.controller, this, context.event.card);
                context.event.window.addEvent(this.game.getEventsForGameAction('sacrifice', context.source, context)[0]);
                context.cancel();
            }
        });
    }
}

IronMine.id = 'iron-mine';

module.exports = IronMine;
