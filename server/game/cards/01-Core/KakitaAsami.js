const DrawCard = require('../../drawcard.js');

class KakitaAsami extends DrawCard {
    setupCardAbilities() {
        this.action ({
            title: 'Take one honor from your opponent',
            condition: () => (
                //Currently participating in a political conflict
                this.game.currentConflict && 
                this.game.currentConflict.conflictType === 'political' &&
                this.game.currentConflict.isParticipating(this) &&

                //Controller is attacker and attackers have higher political skill
                ((this.game.currentConflict.attackingPlayer === this.controller &&
                this.game.currentConflict.attackerSkill > this.game.currentConflict.defenderSkill) ||

                //Controller is defender and defenders have higher political skill
                (this.game.currentConflict.defendingPlayer === this.controller &&
                this.game.currentConflict.defenderSkill > this.game.currentConflict.attackerSkill))
            ),
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
