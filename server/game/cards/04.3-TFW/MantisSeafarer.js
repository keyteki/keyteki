const DrawCard = require('../../drawcard.js');

class MantisSeafarer extends DrawCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.reaction({
            title: 'Gain a fate',
            when: {
                afterConflict: (event, context) => context.source.isParticipating() && event.conflict.winner === context.player
            },
            cost: ability.costs.payHonor(1),
            gameAction: ability.actions.gainFate(),
            limit: ability.limit.unlimitedPerConflict()
        });
    }
}

MantisSeafarer.id = 'mantis-seafarer'; // This is a guess at what the id might be - please check it!!!

module.exports = MantisSeafarer;
