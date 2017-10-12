const DrawCard = require('../../drawcard.js');

class MasterOfTheSpear extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Send home character',
            condition: () => this.game.currentConflict.isAttacking(this),
            handler: () => {
                this.game.promptForSelect(this.controller.opponent, {
                    activePromptTitle: 'Choose a character to send home',
                    cardType: 'character',
                    cardCondition: card => this.game.currentConflict.isParticipating(card) && card.controller !== this.controller && card.allowGameAction('sendHome'),
                    source: this,
                    onSelect: (player, card) => {
                        this.game.addMessage('{0} uses {1} to force {2} to send {3} home', this.controller, this, player, card);
                        this.game.currentConflict.sendHome(card);
                        return true;
                    }
                });
            }
        });
    }
}

MasterOfTheSpear.id = 'master-of-the-spear';

module.exports = MasterOfTheSpear;
