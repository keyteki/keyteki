const ProvinceCard = require('../../provincecard.js');

class FrostbittenCrossing extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'Discard all attachments from a character',
            condition: () => this.game.currentConflict && this.game.currentConflict.conflictProvince === this,
            target: {
                cardType: 'character',
                cardCondition: (card, context) => card.isParticipating() && card.attachments.any(attachment => attachment.allowGameAction('discardFromPlay', context))
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to remove all attachments from {2}', this.controller, this, context.target);
                this.game.applyGameAction(context, { discardFromPlay: context.target.attachments.toArray() });
            }
        });
    }
}

FrostbittenCrossing.id = 'frostbitten-crossing';

module.exports = FrostbittenCrossing;
