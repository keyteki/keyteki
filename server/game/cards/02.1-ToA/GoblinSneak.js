const DrawCard = require('../../drawcard.js');

class GoblinSneak extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Steal a fate',
            when: {
                onCardEntersPlay: event => event.card === this
            },
            handler: () => {
                this.game.addMessage('{0} uses {1}\'s ability to take a fate from {2}', this.controller, this, this.controller.opponent);
                this.game.addFate(this.controller.opponent, -1);
                this.modifyFate(1);
            }
        });
    }
}

GoblinSneak.id = 'goblin-sneak';

module.exports = GoblinSneak;
