const DrawCard = require('../../drawcard.js');

class MotoNergui extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move highest glory character home',
            condition: context => this.game.isDuringConflict('military') && context.source.isParticipating(),
            target: {
                cardCondition: (card, context) => {
                    let participants = context.game.currentConflict.attackers.concat(context.game.currentConflict.defenders);
                    return participants.includes(card) && card.getGlory() === Math.max(...participants.map(c => c.getGlory()));
                },
                gameAction: ability.actions.sendHome()
            }
        });
    }
}

MotoNergui.id = 'moto-nergui';

module.exports = MotoNergui;
