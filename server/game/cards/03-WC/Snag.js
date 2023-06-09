const Card = require('../../Card.js');

class Snag extends Card {
    // Fight: Your opponent must choose the house of the creature Snag fights as their active house on their next turn.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.nextRoundEffect((context) => ({
                targetController: 'opponent',
                effect: ability.effects.restrictHouseChoice(
                    context.event.attackerTarget.getHouses()
                )
            }))
        });
    }
}

Snag.id = 'snag';

module.exports = Snag;
