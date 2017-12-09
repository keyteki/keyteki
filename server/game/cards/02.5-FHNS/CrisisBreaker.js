const DrawCard = require('../../drawcard.js');

class CrisisBreaker extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Ready and bring into play',
            condition: () => {
                const currentConflict = this.game.currentConflict;

                if (!currentConflict || currentConflict.conflictType !== 'military') {
                    return false;
                }

                const originalSkillFunction = currentConflict.skillFunction;

                currentConflict.skillFunction = (card) => card.getSkill('military');
                currentConflict.calculateSkill();

                const conditionFulfilled = currentConflict.attackingPlayer === this.controller ?
                    currentConflict.attackerSkill < currentConflict.defenderSkill :
                    currentConflict.defenderSkill < currentConflict.attackerSkill;

                currentConflict.skillFunction = originalSkillFunction;
                currentConflict.calculateSkill();

                return conditionFulfilled;
            },
            target: {
                activePromptTitle: 'Choose a character',
                cardType: 'character',
                cardCondition: card => card.location === 'play area' && card.hasTrait('berserker') && (!card.isParticipating() || card.bowed)
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
