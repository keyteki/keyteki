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
                gameAction: 'honor',
                cardCondition: card => card.hasTrait('scholar')
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to honor {2}', this.controller, this, context.target);
                this.game.applyGameAction(context, { honor: context.target });
            }
        });
    }
}

AsakoTsuki.id = 'asako-tsuki';

module.exports = AsakoTsuki;
