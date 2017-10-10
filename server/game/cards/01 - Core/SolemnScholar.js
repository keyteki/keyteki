const DrawCard = require('../../drawcard.js');

class SolemnScholar extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Bow an attacking character',
            condition: this.game.currentConflict && this.game.rings.earth.claimedby === this.controller.name,
            target: {
                activePromptTitle: 'Select a character',
                cardType: 'character',
                cardCondition: card => card.location === 'play area' && this.game.currentConflict.isAttacking(card)
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to bow {2}', this.controller, this, context.target);
                this.controller.bowCard(context.target);
            }
        });
    }
}

SolemnScholar.id = 'solemn-scholar';

module.exports = SolemnScholar;
