const DrawCard = require('../../drawcard.js');

class CurryFavor extends DrawCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.reaction({
            title: 'Ready a character'
            when: {
                onParticipantsReturnHome: this.controller.conflicts && this.controller.conflicts.conflictOpportunities === 0 && this.controller.isAttackingPlayer(),
            },
            target: {
                cardType: 'character',
                gameAction: 'discardCardFromPlay',
                cardCondition: card => this.game.currentConflict.isParticipating(card) && this.isAttacking()
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to ready {2}', this.controller, this, context.target);
                this.controller.readyCard(context.target);
            }
        });
    }
}

CurryFavor.id = 'curry-favor';

module.exports = CurryFavor;
