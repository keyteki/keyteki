const Card = require('../../Card.js');

class AmberfinShark extends Card {
    // Play: Give Æmberfin Shark three +1 power counters.
    // At the end of your turn, remove a +1 power counter from Æmberfin Shark. If you do, each player gains 1A.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.addPowerCounter({ amount: 3 })
        });

        this.interrupt({
            when: {
                onRoundEnded: (_, context) => context.player === this.game.activePlayer
            },
            gameAction: ability.actions.removePowerCounter(),
            then: {
                gameAction: ability.actions.gainAmber((context) => ({
                    target: [context.player, context.player.opponent]
                }))
            }
        });
    }
}

AmberfinShark.id = 'æmberfin-shark';

module.exports = AmberfinShark;
