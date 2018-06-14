const DrawCard = require('../../drawcard.js');

class SpiesAtCourt extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Force opponent to discard 2 cards',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.player && event.conflict.conflictType === 'political'
            },
            cost: ability.costs.dishonor(card => card.isParticipating()),
            gameAction: ability.actions.discardAtRandom({ amount: 2 }),
            max: ability.limit.perConflict(1)
        });
    }
}

SpiesAtCourt.id = 'spies-at-court';

module.exports = SpiesAtCourt;
