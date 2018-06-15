const DrawCard = require('../../drawcard.js');

class CurryFavor extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Ready a character',
            when: {
                onReturnHome: (event, context) => event.conflict.attackingPlayer === context.player && event.card.controller === context.player &&
                                                  this.game.completedConflicts.filter(conflict => conflict.attackingPlayer === context.player).length > 1 &&
                                                  !event.bowEvent.cancelled
            },
            cannotBeMirrored: true,
            gameAction: ability.actions.ready(context => ({ target: context.event.card }))
        });
    }
}

CurryFavor.id = 'curry-favor';

module.exports = CurryFavor;
