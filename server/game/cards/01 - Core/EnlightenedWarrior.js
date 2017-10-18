const DrawCard = require('../../drawcard.js');

class EnlightenedWarrior extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Gain 1 fate',
            when: {
                onSelectRingWithFate: () => true
            },
            handler: () => {
                this.game.addMessage('{0} uses {1} to place a fate on him', this.controller, this);
                this.modifyFate(1);
            }
        });
    }
}

EnlightenedWarrior.id = 'enlightened-warrior';

module.exports = EnlightenedWarrior;
