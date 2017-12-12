const DrawCard = require('../../drawcard.js');

class KakitaAsami extends DrawCard {
    setupCardAbilities() {
        this.action ({
            title: 'Take one honor from your opponent',
            condition: () => {
                if(!this.game.currentConflict || this.game.currentConflict.conflictType !== 'political') {
                    return false;
                }

                let diff = this.game.currentConflict.attackerSkill - this.game.currentConflict.defenderSkill;
                return (diff > 0 && this.controller.isAttackingPlayer()) || (diff < 0 && this.controller.isDefendingPlayer());
            },
            handler: context => {
                let otherPlayer = this.game.getOtherPlayer(context.player);
                this.game.addMessage('{0} uses {1} to take 1 honor from {2}',this.controller,this,otherPlayer);
                if(otherPlayer) {
                    this.game.transferHonor(otherPlayer, this.controller, 1);
                } else {
                    this.game.addHonor(this.controller, 1);
                }
            }
        });
    }
}

KakitaAsami.id = 'kakita-asami';

module.exports = KakitaAsami;
