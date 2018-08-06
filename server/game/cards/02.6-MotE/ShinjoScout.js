const DrawCard = require('../../drawcard.js');

class ShinjoScout extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain 1 fate',
            when: {
                onPassDuringDynasty: (event, context) => event.player === context.player && event.firstToPass
            },
            gameAction: ability.actions.gainFate()
        });
    }
}

ShinjoScout.id = 'shinjo-scout';

module.exports = ShinjoScout;
