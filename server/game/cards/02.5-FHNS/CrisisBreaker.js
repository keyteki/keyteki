const DrawCard = require('../../drawcard.js');

class CrisisBreaker extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Ready and bring into play',
            condition: () => {
                if(!this.game.currentConflict || this.game.currentConflict.conflictType !== 'military') {
                    return false;
                }

                let diff = this.game.currentConflict.attackerSkill - this.game.currentConflict.defenderSkill;
                return (diff < 0 && this.controller.isAttackingPlayer()) || (diff > 0 && this.controller.isDefendingPlayer());
            },
            target: {
                activePromptTitle: 'Choose a character',
                cardType: 'character',
                cardCondition: card => card.location === 'play area' && card.hasTrait('berserker') && (card.allowGameAction('moveToConflict') || card.allowGameAction('ready'))
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to ready {2} and move it into the conflict', this.controller, this, context.target);
                this.controller.readyCard(context.target, this);
                this.game.currentConflict.moveToConflict(context.target);
            }
        });
    }
}

CrisisBreaker.id = 'crisis-breaker';

module.exports = CrisisBreaker;
