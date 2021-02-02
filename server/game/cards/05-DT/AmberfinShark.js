const Card = require('../../Card.js');

class AmberfinShark extends Card {
    //Play: Give $this three +1 power counters.
    //At the end of your turn, remove a +1 power counter from $this. If you do, each player gains 1A.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.addPowerCounter((context) => ({
                target: context.source,
                amount: 3
            }))
        });

        this.interrupt({
            when: {
                onRoundEnded: (event, context) => context.player === this.game.activePlayer
            },
            gameAction: ability.actions.removePowerCounter((context) => ({
                target: context.source
            })),
            then: {
                gameAction: [
                    ability.actions.gainAmber(),
                    ability.actions.gainAmber((context) => ({
                        target: context.player.opponent
                    }))
                ]
            }
        });
    }
}

AmberfinShark.id = 'æmberfin-shark';

module.exports = AmberfinShark;
