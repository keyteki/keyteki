const DrawCard = require('../../drawcard.js');

class Kamayari extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Bow character who triggered ability',
            when: {
                onCardAbilityTriggered: (event, context) => event.card.type === 'character' && context.source.parent.isParticipating() && 
                                                            event.card.allowGameAction('bow', context)
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to bow {2}', this.controller, this, context.event.card);
                this.game.applyGameAction(context, { bow: context.target });
            }
        });
    }

    canAttach(card) {
        if(card.hasTrait('bushi')) {
            return super.canAttach(card);
        }
        return false;
    }
}

Kamayari.id = 'kamayari';

module.exports = Kamayari;
