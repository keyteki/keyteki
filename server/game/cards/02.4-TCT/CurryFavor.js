const DrawCard = require('../../drawcard.js');

class CurryFavor extends DrawCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.reaction({
            title: 'Ready a character',
            when: {
                onParticipantsReturnHome: event => event.conflict.attackingPlayer && event.conflict.attackingPlayer === this.controller && event.conflict.attackingPlayer.conflicts.complete === 2,
            },
            target: {
                cardType: 'character',
                gameAction: 'ready',
                cardCondition: card => this.game.currentConflict.isParticipating(card) && card.controller === this.controller
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
