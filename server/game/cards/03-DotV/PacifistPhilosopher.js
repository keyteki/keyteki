const DrawCard = require('../../drawcard.js');

class PacifistPhilosopher extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain 1 fate',
            limit: ability.limit.perRound(2),
            when: {
                onConflictPass: () => true
            },
            gameAction: ability.actions.gainFate()
        });
    }
}

PacifistPhilosopher.id = 'pacifist-philosopher';

module.exports = PacifistPhilosopher;
