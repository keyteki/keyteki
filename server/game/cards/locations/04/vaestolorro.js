const DrawCard = require('../../../drawcard.js');

class VaesTolorro extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCharacterKilled: event => event.card.getPower() >= 1
            },
            cost: ability.costs.kneelSelf(),
            handler: context => {
                let pendingCard = context.event.card;
                var power = pendingCard.getPower() >= 2 && pendingCard.getStrength() === 0 ? 2 : 1;

                pendingCard.modifyPower(-power);
                this.modifyPower(power);
                this.game.addMessage('{0} kneels {1} to move {2} power from {3} to {1}',
                                      this.controller, this, power, pendingCard);
            }
        });
    }
}

VaesTolorro.code = '04074';

module.exports = VaesTolorro;
