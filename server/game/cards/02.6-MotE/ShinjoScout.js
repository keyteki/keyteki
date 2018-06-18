const DrawCard = require('../../drawcard.js');

class ShinjoScout extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain 1 fate',
            when: {
                onFirstPassDuringDynasty: (event, context) => event.player === context.player
            },
            gameAction: ability.actions.gainFate()
        });
    }
}

ShinjoScout.id = 'shinjo-scout';

module.exports = ShinjoScout;
