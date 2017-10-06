const DrawCard = require('../../drawcard.js');

class AdeptOfShadows extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Return to hand',
            cost: ability.costs.payHonor(1),
            handler: () => {
                this.owner.returnCardToHand(this);
                this.game.addMessage('{0} returns {1} to their hand', this.controller, this);
            }
        });
    }
}

AdeptOfShadows.id = 'adept-of-shadows';

module.exports = AdeptOfShadows;
