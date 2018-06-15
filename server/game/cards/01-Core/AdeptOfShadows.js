const DrawCard = require('../../drawcard.js');

class AdeptOfShadows extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Return to hand',
            cost: ability.costs.payHonor(1),
            gameAction: ability.actions.returnToHand()
        });
    }
}

AdeptOfShadows.id = 'adept-of-shadows';

module.exports = AdeptOfShadows;
