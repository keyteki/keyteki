const DrawCard = require('../../drawcard.js');

class AsakoTsuki extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Honor a scholar character',
            when: {
                onClaimRing: event => event.conflict && event.conflict.conflictRing === 'water'
            },
            target: {
                cardType: 'character',
                cardCondition: (card, context) => card.location === 'play area' && card.hasTrait('scholar') && card.allowGameAction('honor', context)
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to honor {2}', this.controller, this, context.target);
                this.controller.honorCard(context.target, this);
            }
        });
    }
}

AsakoTsuki.id = 'asako-tsuki';

module.exports = AsakoTsuki;
