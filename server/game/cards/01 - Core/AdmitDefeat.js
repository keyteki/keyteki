const DrawCard = require('../../drawcard.js');

class AdmitDefeat extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            cost: ability.costs.payHonor(1),
            condition: this.game.currentConflict && this.game.currentConflict.defenders.length === 1,
            clickToActivate: true,
            target: {
                cardType: 'character',
                cardCondition: card => this.game.currentConflict.isDefending(card)
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to bow {2}', this.controller, this, context.target);
                context.target.owner.bowCard(context.target);
            }
        });
    }
}

AdmitDefeat.id = 'admit-defeat';

module.exports = AdmitDefeat;
