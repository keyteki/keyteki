const DrawCard = require('../../drawcard.js');

class VengefulOathkeeper extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Put this into play',
            when: {
                afterConflict: (event, context) => event.conflict.loser === context.player && 
                                                   event.conflict.conflictType === 'military' &&
                                                   context.source.allowGameAction('putIntoPlay', context)
            },
            location: 'hand',
            handler: context => {
                this.game.addMessage('{0} puts {1} into play from their hand', this.controller, this);
                this.game.applyGameAction(context, { putIntoPlay: this });
            }
        });
    }
}

VengefulOathkeeper.id = 'vengeful-oathkeeper';

module.exports = VengefulOathkeeper;

