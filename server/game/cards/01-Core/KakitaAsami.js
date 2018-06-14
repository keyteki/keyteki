const DrawCard = require('../../drawcard.js');

class KakitaAsami extends DrawCard {
    setupCardAbilities(ability) {
        this.action ({
            title: 'Take one honor from your opponent',
            condition: context => {
                let diff = this.game.currentConflict.attackerSkill - this.game.currentConflict.defenderSkill;
                return this.game.isDuringConflict('political') && (context.isAttackingPlayer() ? diff < 0 : diff > 0);
            },
            gameAction: ability.actions.takeHonor()
        });
    }
}

KakitaAsami.id = 'kakita-asami';

module.exports = KakitaAsami;
