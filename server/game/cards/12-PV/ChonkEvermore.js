const Card = require('../../Card.js');

class ChonkEvermore extends Card {
    // Play: You may give two creatures a +1 power counter. Double the number of +1 power counters on each creature.
    // Fate: Give each enemy creature two +1 power counters.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                mode: 'upTo',
                numCards: 2,
                gameAction: ability.actions.addPowerCounter()
            },
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.addPowerCounter((context) => ({
                    target: context.game.creaturesInPlay.filter((card) => !!card.tokens.power),
                    multiplier: 2
                })),
                message: '{0} uses {1} to double the number of +1 power counters on each creature',
                messageArgs: (context) => [context.player, context.source]
            }
        });

        this.fate({
            gameAction: ability.actions.addPowerCounter((context) => ({
                target: context.game.activePlayer.opponent.creaturesInPlay,
                amount: 2
            }))
        });
    }
}

ChonkEvermore.id = 'chonk-evermore';

module.exports = ChonkEvermore;
