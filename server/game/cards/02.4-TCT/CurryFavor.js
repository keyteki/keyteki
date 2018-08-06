const DrawCard = require('../../drawcard.js');

class CurryFavor extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Ready a character',
            when: {
                onReturnHome: (event, context) => {
                    if(this.game.getConflicts(context.player).filter(conflict => !conflict.passed).length !== 2) {
                        return false;
                    }
                    return event.conflict.attackingPlayer === context.player && event.card.controller === context.player && !event.bowEvent.cancelled;
                }
            },
            cannotBeMirrored: true,
            gameAction: ability.actions.ready(context => ({ target: context.event.card }))
        });
    }
}

CurryFavor.id = 'curry-favor';

module.exports = CurryFavor;
