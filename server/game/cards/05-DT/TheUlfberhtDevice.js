const Card = require('../../Card.js');

class TheUlfberhtDevice extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChooseActiveHouse: () => true
            },
            effect: 'stop {1} from choosing {2} as their active house on their next turn',
            effectArgs: (context) => [
                context.player.opponent,
                context.game.activePlayer.activeHouse
            ],
            gameAction: ability.actions.lastingEffect((context) => ({
                duration: 'untilNextTurn',
                effect: ability.effects.stopHouseChoice(context.game.activePlayer.activeHouse)
            }))
        });
    }
}

TheUlfberhtDevice.id = 'the-ulfberht-device';

module.exports = TheUlfberhtDevice;
