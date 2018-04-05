const DrawCard = require('../../drawcard.js');

class PacifistPhilosopher extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain 1 fate',
            limit: ability.limit.perRound(2),
            when: {
                onConflictPass: () => true
            },
            handler: () => {
                this.game.addMessage('{0} uses {1} to gain 1 fate.', this.controller, this);
                this.game.addFate(this.controller, 1);
            }
        });
    }
}

PacifistPhilosopher.id = 'pacifist-philosopher';

module.exports = PacifistPhilosopher;
