const DrawCard = require('../../drawcard.js');

class AdeptOfShadows extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Return to hand',
            cost: ability.costs.payHonor(1),
            handler: context => {
                this.game.addMessage('{0} returns {1} to their hand', this.controller, this);
                this.game.applyGameAction(context, { returnToHand: context.source });
            }
        });
    }
}

AdeptOfShadows.id = 'adept-of-shadows';

module.exports = AdeptOfShadows;
