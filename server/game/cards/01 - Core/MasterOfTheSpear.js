const DrawCard = require('../../drawcard.js');

class MasterOfTheSpear extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Send home character',
            condition: () => this.isAttacking(),
            target: {
                player: 'opponent',
                activePromptTitle: 'Choose a character to send home',
                cardType: 'character',
                gameAction: 'sendHome',
                cardCondition: card => card.isParticipating() && card.controller !== this.controller,
                source: this
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to force {2} to send {3} home', this.controller, this, this.controller.opponent, context.target);
                this.game.currentConflict.sendHome(context.target);
            }
        });
    }
}

MasterOfTheSpear.id = 'master-of-the-spear';

module.exports = MasterOfTheSpear;
