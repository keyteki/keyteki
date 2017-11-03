const DrawCard = require('../../drawcard.js');

class JadeTetsubo extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Return all fate from a character',
            cost: ability.costs.bowSelf(),
            condition: () => this.game.currentConflict && this.parent.isParticipating(),
            target: {
                activePromptTitle: 'Choose a character',
                cardType: 'character',
                cardCondition: card => (
                    card.isParticipating() &&
                    card.getMilitarySkill() < this.parent.getMilitarySkill() &&
                    card.getFate() > 0
                )
            },
            handler: (context) => {
                this.game.addMessage('{0} uses {1} to return all fate from {2}', this.controller, this, context.target);
                let fateToAdd = context.target.getFate();
                context.target.modifyFate(-fateToAdd);
                this.game.addFate(context.target.controller, fateToAdd);
            }
        });
    }

    canAttach(card) {
        if(this.controller !== card.controller) {
            return false;
        }

        return super.canAttach(card);
    }
}

JadeTetsubo.id = 'jade-tetsubo';

module.exports = JadeTetsubo;
