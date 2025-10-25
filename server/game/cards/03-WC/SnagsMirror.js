const Card = require('../../Card.js');

class SnagsMirror extends Card {
    // After a player chooses an active house, their opponent cannot choose the same house as their active house on their next turn.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChooseActiveHouse: (event, context) => event.player === context.player
            },
            gameAction: ability.actions.duringOpponentNextTurn((context) => ({
                targetController: 'opponent',
                effect: ability.effects.stopHouseChoice(context.event.house)
            })),
            message:
                '{0} uses {1} to prevent {2} from choosing {3} as their active house on their next turn',
            messageArgs: (context) => [
                context.player,
                context.source,
                context.player.opponent,
                context.event.house
            ]
        });

        this.reaction({
            when: {
                onChooseActiveHouse: (event, context) => event.player !== context.player
            },
            gameAction: ability.actions.untilPlayerNextTurnEnd((context) => ({
                targetController: 'player',
                effect: ability.effects.stopHouseChoice(context.event.house)
            })),
            message:
                '{0} uses {1} to prevent {2} from choosing {3} as their active house on their next turn',
            messageArgs: (context) => [
                context.player.opponent,
                context.source,
                context.player,
                context.event.house
            ]
        });
    }
}

SnagsMirror.id = 'snag-s-mirror';

module.exports = SnagsMirror;
