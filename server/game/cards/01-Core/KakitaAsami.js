const DrawCard = require('../../drawcard.js');

class KakitaAsami extends DrawCard {
    setupCardAbilities() {
        this.action ({
            title: 'Take one honor from your opponent',
            condition: () => {
                if(!this.isParticipating() || this.game.currentConflict.conflictType !== 'political' || !this.controller.opponent) {
                    return false;
                }

                let diff = this.game.currentConflict.attackerSkill - this.game.currentConflict.defenderSkill;
                return (diff > 0 && this.controller.isAttackingPlayer()) || (diff < 0 && this.controller.isDefendingPlayer());
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to take 1 honor from {2}', context.player, context.source, context.player.opponent);
                this.game.transferHonor(context.player.opponent, context.player, 1);
            }
        });
    }
}

KakitaAsami.id = 'kakita-asami';

module.exports = KakitaAsami;
