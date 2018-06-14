const DrawCard = require('../../drawcard.js');

class EnlightenedWarrior extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain 1 fate',
            when: {
                onSelectRingWithFate: (event, context) => event.player === context.player.opponent 
            },
            gameAction: ability.actions.placeFate()
        });
    }
}

EnlightenedWarrior.id = 'enlightened-warrior';

module.exports = EnlightenedWarrior;
