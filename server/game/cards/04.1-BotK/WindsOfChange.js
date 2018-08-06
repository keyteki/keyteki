const DrawCard = require('../../drawcard.js');

class WindsOfChange extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            condition: () => this.game.rings.air.claimed,
            title: 'Return the air ring to the unclaimed pool',
            effect: 'return the air ring to the unclaimed pool',
            gameAction: ability.actions.returnRing(context => ({
                target: context.game.rings.air
            }))
        });
    }
}

WindsOfChange.id = 'winds-of-change';

module.exports = WindsOfChange;
