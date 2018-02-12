const DrawCard = require('../../drawcard.js');

class BrashSamurai extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Honor this character',
            condition: context => this.allowGameAction('honor', context) && (
                (this.isAttacking() && this.game.currentConflict.attackers.length === 1) ||
                (this.isDefending() && this.game.currentConflict.defenders.length === 1)),
            handler: context => {
                this.game.addMessage('{0} uses {1} to honor himself', this.controller, this);
                this.game.applyGameAction(context, { honor: this });
            } 
        });
    }
}

BrashSamurai.id = 'brash-samurai';

module.exports = BrashSamurai;
