const DrawCard = require('../../drawcard.js');

class WayOfTheScorpion extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Dishonor a participating character',
            clickToActivate: true,
            condition: () => this.game.currentConflict,
            target: {
                activePromptTitle: 'Choose a character',
                cardType: 'character',
                cardCondition: card => card.location === 'play area' && !card.isFaction('scorpion') && this.game.currentConflict.isParticipating(card)
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to dishonor {2}', this.controller, this, context.target);
                this.controller.dishonorCard(context.target);
            }
        });
    }
}

WayOfTheScorpion.id = 'way-of-the-scorpion';

module.exports = WayOfTheScorpion;
