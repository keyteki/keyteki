const DrawCard = require('../../drawcard.js');

class HonoredBlade extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain 1 honor',
            when: {
                afterConflict: (event, context) => context.source.parent.isParticipating() &&
                                                   event.conflict.winner === context.source.parent.controller
            },
            gameAction: ability.actions.gainHonor()
        });
    }
}

HonoredBlade.id = 'honored-blade';

module.exports = HonoredBlade;
