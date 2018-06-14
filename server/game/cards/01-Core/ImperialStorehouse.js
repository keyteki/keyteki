const DrawCard = require('../../drawcard.js');

class ImperialStorehouse extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Draw a card',
            cost: ability.costs.sacrificeSelf(),
            gameAction: ability.actions.draw()
        });
    }
}

ImperialStorehouse.id = 'imperial-storehouse';

module.exports = ImperialStorehouse;
