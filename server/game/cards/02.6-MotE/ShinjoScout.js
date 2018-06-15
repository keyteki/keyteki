const DrawCard = require('../../drawcard.js');

class ShinjoScout extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Gain 1 fate',
            when: {
                onFirstPassDuringDynasty: event => event.player === this.controller
            },
            handler: () => {
                this.game.addMessage('{0} uses {1} to gain 1 fate', this.controller, this);
                this.game.addFate(this.controller, 1);
            }
        });
    }
}

ShinjoScout.id = 'shinjo-scout';

module.exports = ShinjoScout;
