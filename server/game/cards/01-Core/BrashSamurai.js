const DrawCard = require('../../drawcard.js');

class BrashSamurai extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Honor this character',
            condition: () => this.game.currentConflict && (
                (this.game.currentConflict.isAttacking(this) && this.game.currentConflict.attackers.length === 1) ||
                (this.game.currentConflict.isDefending(this) && this.game.currentConflict.defenders.length === 1)),
            handler: () => {
                this.game.addMessage('{0} uses {1} to honor himself', this.controller, this);
                this.controller.honorCard(this, this);
            } 
        });
    }
}

BrashSamurai.id = 'brash-samurai';

module.exports = BrashSamurai;
