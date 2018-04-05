const DrawCard = require('../../drawcard.js');

class MotoNergui extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move highest glory character home',
            condition: context => context.source.isParticipating() && context.game.currentConflict.conflictType === 'military',
            target: {
                cardType: 'character',
                gameAction: 'sendHome',
                cardCondition: (card, context) => {
                    let participants = context.game.currentConflict.attacker.concat(context.game.currenctConflict.defenders);
                    return participants.includes(card) && card.getGlory() === Math.max(participants.map(c => c.getGlory()));
                }
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to send {2} home', context.player, context.source, context.target);
                this.game.applyGameAction(context, { sendHome: context.target });
            }
        });
    }
}

MotoNergui.id = 'moto-nergui';

module.exports = MotoNergui;
