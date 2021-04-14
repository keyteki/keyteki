const Card = require('../../Card.js');

class TheUlfberhtDevice extends Card {
    // Each player cannot choose the same active house they chose on their previous turn.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChooseActiveHouse: () => true
            },
            effect: 'block {1} as their active house on their next turn',
            effectArgs: (context) => [context.game.activePlayer.activeHouse],
            gameAction: ability.actions.lastingEffect((context) => ({
                duration: 3,
                targetController: 'any',
                effect: ability.effects.stopHouseChoice(context.game.activePlayer.activeHouse)
            }))
        });
    }
}

TheUlfberhtDevice.id = 'the-ulfberht-device';

module.exports = TheUlfberhtDevice;
