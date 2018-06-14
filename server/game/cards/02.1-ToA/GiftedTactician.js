const DrawCard = require('../../drawcard.js');

class GiftedTactician extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Draw a card',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.player && context.source.isParticipating() && 
                                                   event.conflict.conflictType === 'military'
            },
            gameAction: ability.actions.draw()
        });
    }
}

GiftedTactician.id = 'gifted-tactician';

module.exports = GiftedTactician;
