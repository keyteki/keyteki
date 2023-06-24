const Card = require('../../Card.js');

class SnagsMirror extends Card {
    // After a player chooses an active house, their opponent cannot choose the same house as their active house on their next turn.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChooseActiveHouse: () => true
            },
            gameAction: ability.actions.nextRoundEffect((context) => ({
                targetController: 'any',
                effect: ability.effects.stopHouseChoice(context.event.house)
            }))
        });
    }
}

SnagsMirror.id = 'snag-s-mirror';

module.exports = SnagsMirror;
