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
                cardCondition: (card, context) => card.hasTrait('berserker') && card.controller === context.player &&
                                                  (card.allowGameAction('moveToConflict') || card.allowGameAction('ready'))
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to ready {2} and move it into the conflict', this.controller, this, context.target);
                this.game.applyGameAction(context, { moveToConflict: context.target, ready: context.target });
            }
        });
    }
}

CrisisBreaker.id = 'crisis-breaker';

module.exports = CrisisBreaker;
