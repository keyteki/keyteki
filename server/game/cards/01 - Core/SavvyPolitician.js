const DrawCard = require('../../drawcard.js');

class SavvyPolitician extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                'onCardHonored': event => event.card === this
            },
            target: {
                cardCondition: card => card.location === 'play area' && card.getType() === 'character'
            },
            handler: context => {
                this.game.addMessage('{0} uses {1}\'s ability to honor {2}', this.controller, this, context.target);
                this.controller.honorCard(context.target);
            }
        });
    }
}

SavvyPolitician.id = 'savvy-politician';

module.exports = SavvyPolitician;
