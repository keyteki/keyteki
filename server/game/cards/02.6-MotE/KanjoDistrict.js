const DrawCard = require('../../drawcard.js');

class KanjoDistrict extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow and send home a participating character',
            cost: ability.costs.discardImperialFavor(),
            target: {
                cardType: 'character',
                cardCondition: card => card.isParticipating() && (card.allowGameAction('bow') || card.allowGameAction('sendHome'))
            },
            handler: context => {
                let message = '';
                if(context.target.allowGameAction('bow')) {
                    message = '{0} uses {1} to bow {2}';
                    this.controller.bowCard(context.target, this);
                }
                if(context.target.allowGameAction('sendHome')) {
                    message = message ? '{0} uses {1} to bow and send {2} home' : '{0} uses {1} to send {2} home';
                    this.game.currentConflict.sendHome(context.target);
                }
                this.game.addMessage(message, this.controller, this, context.target);
            }
        });
    }
}

KanjoDistrict.id = 'kanjo-district';

module.exports = KanjoDistrict;
