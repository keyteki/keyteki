const DrawCard = require('../../drawcard.js');

class CrisisBreaker extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Ready and bring into play',
            condition: context => {
                if(this.game.isDuringConflict('military')) {
                    let diff = this.game.currentConflict.attackerSkill - this.game.currentConflict.defenderSkill;
                    return context.player.isAttackingPlayer() ? diff < 0 : diff > 0;
                }
                return false;
            },
            target: {
                cardType: 'character',
                controller: 'self',
                cardCondition: card => card.hasTrait('berserker'),
                gameAction: [ability.actions.ready(), ability.actions.moveToConflict()]
            },
            effect: 'ready {0} and move it into the conflict'
        });
    }
}

CrisisBreaker.id = 'crisis-breaker';

module.exports = CrisisBreaker;
