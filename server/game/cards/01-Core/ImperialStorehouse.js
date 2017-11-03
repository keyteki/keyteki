const DrawCard = require('../../drawcard.js');

class ImperialStorehouse extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Draw a card',
            cost: ability.costs.sacrificeSelf(),
            handler: () => {
                this.controller.drawCardsToHand(1);
                this.game.addMessage('{0} sacrifices {1} to draw a conflict card', this.controller, this);
            }
        });
    }
}

ImperialStorehouse.id = 'imperial-storehouse';

module.exports = ImperialStorehouse;
