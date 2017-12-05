const DrawCard = require('../../drawcard.js');

class WayOfTheChrysanthemum extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain extra honor after bid',
            max: ability.limit.perRound(1),
            when: {
                onHonorTradedAfterBid: event => event.receiver === this.controller
            },
            handler: context => {
                this.game.addMessage('{0} plays {1}, gaining an additional {2} honor', this.controller, this, context.event.amount);
                this.game.addHonor(this.controller, context.event.amount);
            }
        });
    }
}

WayOfTheChrysanthemum.id = 'way-of-the-chrysanthemum';

module.exports = WayOfTheChrysanthemum;
