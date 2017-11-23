const ProvinceCard = require('../../provincecard.js');

class FrostbittenCrossing extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'Discard all attachments from a character',
            condition: () => this.game.currentConflict && this.game.currentConflict.conflictProvince === this,
            target: {
                cardType: 'character',
                cardCondition: card => card.isParticipating() && card.attachments.size() > 0
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to remove all attachments from {2}', this.controller, this, context.target);
                context.target.removeAllAttachments();
            }
        });
    }
}

FrostbittenCrossing.id = 'frostbitten-crossing';

module.exports = FrostbittenCrossing;
