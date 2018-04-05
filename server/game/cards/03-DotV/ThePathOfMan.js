const DrawCard = require('../../drawcard.js');

class ThePathOfMan extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Gain 2 fate',
            when: {
                afterConflict: event => event.conflict.winner === this.controller && event.conflict.skillDifference > 4
            },
            handler: () => {
                this.game.addMessage('{0} plays {1} to gain 2 fate', this.controller, this);
                this.game.addFate(this.controller, 2);
            }
        });
    }
}

ThePathOfMan.id = 'the-path-of-man';

module.exports = ThePathOfMan;
